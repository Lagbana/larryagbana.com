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
      case "GET":
        const urlId = event.pathParameters["urlId"];
        if (!urlId) {
          result = {
            statusCode: 404,
            body: "Not found: No URL provided!",
          };
          break;
        }
        result = await coreService.getOriginalUrl(urlId);
        break;
      case "POST":
        const body = JSON.parse(event.body) as { url: string };
        if (!isValidURL(body.url)) {
          return {
            statusCode: 400,
            body: "Bad request: Invalid URL.",
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
