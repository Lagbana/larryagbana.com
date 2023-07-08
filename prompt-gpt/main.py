import os
import openai
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import asyncio

from typing import List

load_dotenv()
app = FastAPI()
openai.api_key = os.getenv("OPENAI_API_KEY")


@app.get("/")
def read_root():
    return {"Hello": "World"}


"""
Prompting Principles
Principle 1: Write clear and specific instructions
Principle 2: Give the model time to “think”
"""

async def generate_response(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            temperature=0,  # degree of randomness of the model's output
        )
        return response.choices[0].message["content"]
    except openai.error.APIErro as e:
        print(f"OpenAI API error: {e}")
        return ""
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing your request"
        )


text = f"""
You should express what you want a model to do by 
providing instructions that are as clear and 
specific as you can possibly make them. 
This will guide the model towards the desired output, 
and reduce the chances of receiving irrelevant 
or incorrect responses. Don't confuse writing a 
clear prompt with writing a short prompt. 
In many cases, longer prompts provide more clarity 
and context for the model, which can lead to 
more detailed and relevant outputs.
"""

prompt = f"""
Summarize the text delimited by triple backticks
into a single sentence.
```{text}``` 
"""

response = asyncio.run(generate_response(prompt))
print(response)
