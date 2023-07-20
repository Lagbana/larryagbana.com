import json
import os
import openai
import tiktoken
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List

load_dotenv()
app = FastAPI()
openai.api_key = os.getenv("OPENAI_API_KEY")


@app.get("/")
def read_root():
    return {"Hello": "World"}


def count_tokens_used(text: str, model="gpt-3.5-turbo") -> int:
    try:
        encoding = tiktoken.encoding_for_model(model)
    except:
        print("Warning: model not found. Using cl100k_base encoding")
        encoding = tiktoken.get_encoding("cl100k_base")

    num_tokens = len(encoding.encode(text))
    return num_tokens


# 1,000 tokens is about 750 words.
# 1.333 tokens per word

GPT3_5_TURBO = "gpt-3.5-turbo"
"""
Offers same function as calling GPT-3 with more reliable steerability 
via the system message. Enables guiding the model's responses more
effectively. $ 0.0015 per 1k input tokens and $ 0.002 per 1k output tokens.
"""


GPT3_5_TURBO_16K = "gpt-3.5-turbo-16k"
"""
Offers 4 times the context length of GPT3_5_TURBO, twice the price,
$ 0.003 per 1k input tokens and $ 0.004 per 1k output tokens.
Handles ~ 20 pages of input text in a single request.
"""


gpt3_models = {
    "8k": GPT3_5_TURBO,
    "16k": GPT3_5_TURBO_16K,
}


class TokenCountAndCost(BaseModel):
    req_token_count: int
    res_token_count: int
    total_cost: float


def estimate_token_count_and_cost(
    inputText: str, outputText: str, model=gpt3_models["8k"]
) -> TokenCountAndCost:
    estimated_request_tokens = count_tokens_used(inputText, model)
    estimated_response_tokens = count_tokens_used(outputText, model)

    if model == gpt3_models["8k"]:
        """
        $ 0.0015 per 1k input tokens and $ 0.002 per 1k output tokens.
        """
        request_cost = (estimated_request_tokens * 0.0015) / 1000
        response_cost = (estimated_response_tokens * 0.002) / 1000
        total_cost = request_cost + response_cost

        return {
            "req_token_count": estimated_request_tokens,
            "res_token_count": estimated_response_tokens,
            "total_cost": total_cost,
        }

    elif model == gpt3_models["16k"]:
        """
        $ 0.003 per 1k input tokens and $ 0.004 per 1k output tokens.
        """
        request_cost = (estimated_request_tokens * 0.003) / 1000
        response_cost = (estimated_response_tokens * 0.004) / 1000
        total_cost = request_cost + response_cost

        return {
            "req_token_count": estimated_request_tokens,
            "res_token_count": estimated_response_tokens,
            "total_cost": total_cost,
        }
    else:
        raise ValueError("Model not supported!")


def model_response(prompt, model=gpt3_models["8k"]):
    messages = [{"role": "user", "content": prompt}]
    try:
        """
        top_p is an alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
        We generally recommend altering this or temperature but not both.
        """
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            temperature=0,  # degree of randomness of the model's output
            # max_tokens=1,
        )
        return response
    except openai.error.APIError as e:
        print(f"OpenAI API error: {e}")
        return ""
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing your request"
        )


def generate_response(prompt: str, model=gpt3_models["8k"]):
    response = model_response(prompt, model)
    client_response: str = response.choices[0].message["content"]
    estimated_tokens_and_cost = estimate_token_count_and_cost(
        prompt, client_response, model
    )
    print(
        f"""
        
          ======================================
          Estimated Req tokens: {estimated_tokens_and_cost["req_token_count"]}, 
          Estimated Res tokens: {estimated_tokens_and_cost["res_token_count"]}
          Estimated cost: {estimated_tokens_and_cost["total_cost"]}
          Actual Open AI tokens: {response["usage"]["prompt_tokens"]}
          ======================================
          
          """
    )

    return client_response


def summarize_prompt(text: str):
    return f"""
Summarize the text delimited by triple backticks
into a single sentence.
```{text}``` 
"""


def check_steps_prompt(text: str):
    return f"""
You will be provided with text delimited by triple quotes. 
If it contains a sequence of instructions, \ 
re-write those instructions in the following format:

Step 1 - ...
Step 2 - …
…
Step N - …

If the text does not contain a sequence of instructions, \ 
then simply write \"No steps provided.\"

\"\"\"{text}\"\"\"
"""


def get_sentiment_prompt(text: str):
    return f"""
What is the sentiment of the following product review, 
which is delimited with triple backticks?

Give your answer as a single word, either "positive" \
or "negative".

Review text: '''{text}'''
"""


def identify_anger_prompt(text: str):
    return f"""
Is the writer of the following review expressing anger?\
The review is delimited with triple backticks. \
Give your answer as either yes or no.

Review text: '''{text}'''
"""


def sentiment_analysis_prompt(text: str):
    return f"""
Identify the following items from the review text: 
- Sentiment (positive or negative)
- Is the reviewer expressing anger? (true or false)
- Item purchased by reviewer
- Company that made the item

The review is delimited with triple backticks. \
Format your response as a JSON object with \
"Sentiment", "Anger", "Item" and "Brand", "TokenCost" as the keys.
If the information isn't present, use "unknown" \
as the value.
Make your response as short as possible.
Format the Anger value as a boolean.

Review text: '''{text}'''
"""


def infer_topics_prompt(story: str):
    return f"""
Determine five topics that are being discussed in the \
following text, which is delimited by triple backticks.

Make each item one or two words long. 

Format your response as a list of items separated by commas.

Text sample: '''{story}'''
"""


def news_alert_prompt(story: str):
    topic_list = [
        "nasa",
        "local government",
        "engineering",
        "employee satisfaction",
        "federal government",
    ]
    
    return f"""
Determine whether each item in the following list of \
topics is a topic in the text below, which
is delimited with triple backticks.

Give your answer as a dict with 0 or 1 score for each topic.\

List of topics: {", ".join(topic_list)}

Text sample: '''{story}'''
"""


class Prompt(BaseModel):
    text: str


@app.post("/generate-summary")
async def generate_summary(prompt: Prompt):
    response = await generate_response(summarize_prompt(prompt.text))
    return {"response": response}


@app.post("/general-prompt")
async def general_prompt(prompt: Prompt):
    response = generate_response(prompt.text)
    return {"response": response}


@app.post("/check-conditions")
async def check_conditions(prompt: Prompt):
    response = generate_response(check_steps_prompt(prompt.text))
    return {"response": response}


@app.post("/few-shots")
async def check_conditions(prompt: Prompt):
    response = generate_response(prompt.text)
    return {"response": response}


@app.post("/get-sentiment")
async def get_sentiment(prompt: Prompt):
    response = generate_response(get_sentiment_prompt(prompt.text))
    return {"response": response}


@app.post("/identify-anger")
async def identify_anger(prompt: Prompt):
    response = generate_response(identify_anger_prompt(prompt.text))
    return {"response": response}


@app.post("/sentiment_analysis")
async def sentiment_analysis(prompt: Prompt):
    response = generate_response(sentiment_analysis_prompt(prompt.text))
    return {"response": response}


@app.post("/infer-topics")
async def infer_topics(prompt: Prompt):
    try:
        request_prompt = infer_topics_prompt(prompt.text)
        response = generate_response(request_prompt)
        return {"response": response.split(sep=",")}
    except Exception as e:
        print(f"Exception: {e}")
        # Handle specific exceptions if needed, and return appropriate HTTP status codes and error messages
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.post("/news-alert")
async def news_alert(prompt: Prompt):
    try:
        request_prompt = news_alert_prompt(prompt.text)
        response = generate_response(request_prompt)
        print(f"✅ {response}")
        topic_dict = json.loads(response)
        if topic_dict['nasa'] == 1:
            print("ALERT: New NASA story!")
            
        return {"response": response}
    except Exception as e:
        print(f"Exception: {e}")
        # Handle specific exceptions if needed, and return appropriate HTTP status codes and error messages
        raise HTTPException(status_code=500, detail="Internal Server Error")
