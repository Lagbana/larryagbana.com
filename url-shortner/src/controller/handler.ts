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
        const body = JSON.parse(event.body) as { url: string };
        if (!isValidURL(body.url)) {
          return {
            statusCode: 400,
            body: JSON.stringify(`Bad request: Invalid URL.`),
          };
        }
        result = await coreService.createShortenedUrl(body.url);
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
