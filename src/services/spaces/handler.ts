import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { createSpaces } from "./createSpaces";
import { getSpaces } from "./getSpaces";
import { updateSpaces } from "./updateSpaces";
import { deleteSpaces } from "./deleteSpaces";

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
      case "PUT":
        const updateResponse = await updateSpaces(event, dynamoDBClient);
        return updateResponse;
      case "DELETE":
        const deleteResponse = await deleteSpaces(event, dynamoDBClient);
        console.log(deleteResponse);
        return deleteResponse;
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
