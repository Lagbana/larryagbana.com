import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { createSpaces } from "./createSpaces";
import { getSpaces } from "./getSpaces";

// TODO: move this to a shared location
const dynamoDBClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;

  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, dynamoDBClient);
        console.log(getResponse);
        return getResponse;
      case "POST":
        const createResponse = await createSpaces(event, dynamoDBClient);
        return createResponse;
      case "DELETE":
        message = "Hello from DELETE";
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify(err.message),
    };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };

  return response;
}

export { handler };
