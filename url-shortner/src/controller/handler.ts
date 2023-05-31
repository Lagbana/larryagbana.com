import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { CoreService } from "../core/shortner";
import { isValidURL } from "../core/util";

const coreService = new CoreService();
export async function handler(event: APIGatewayProxyEvent, context: Context) {
  let result: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case "POST":
        if (!isValidURL(event.body)) {
          return {
            statusCode: 400,
            body: JSON.stringify(`Bad request: Invalid URL.`),
          };
        }
        result = await coreService.createShortenedUrl(event.body);
        break;
      default:
        break;
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err.message),
    };
  }

  return result;
}
