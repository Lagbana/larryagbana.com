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
import {
  InvalidJsonError,
  MissingFieldError,
  addCorsHeader,
} from "../../utils";

// TODO: move this to a shared location
const dynamoDBClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let result: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case "GET":
        result = await getSpaces(event, dynamoDBClient);
        break;
      case "POST":
        result = await createSpaces(event, dynamoDBClient);
        break;
      case "PUT":
        result = await updateSpaces(event, dynamoDBClient);
        break;
      case "DELETE":
        result = await deleteSpaces(event, dynamoDBClient);
        break;
      default:
        break;
    }
  } catch (err) {
    if (err instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(err.message),
      };
    }

    if (err instanceof InvalidJsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify(err.message),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify(err.message),
    };
  }

  // const response: APIGatewayProxyResult = {
  //   statusCode: 200,
  //   body: JSON.stringify(message),
  // };

  addCorsHeader(result);

  return result;
}

export { handler };
