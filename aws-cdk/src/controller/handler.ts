import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { CoreService } from "../core/shortner";
import { isValidURL } from "../core/util";
import { responseWithCorsHeaders } from "./util";
import { getEnvVar } from "../config";

const coreService = new CoreService();
export async function handler(event: APIGatewayProxyEvent, context: Context) {
  let result: APIGatewayProxyResult;
  const requestId = context.awsRequestId;

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
        let body: { url: string };
        if (event.body) {
          body = JSON.parse(event.body);
        }
        if (body.url && !isValidURL(body.url)) {
          result = {
            statusCode: 400,
            body: "Bad request: Invalid URL.",
          };
          break;
        }
        result = await coreService.createShortenedUrl(body.url, requestId);
        break;
      default:
        result = {
          statusCode: 405,
          body: "Method not allowed",
        };
        break;
    }
  } catch (err) {
    console.error(err.message);
    result = {
      statusCode: 500,
      body: "Something went wrong!",
    };
  }

  return responseWithCorsHeaders(result, getEnvVar("CORS_ORIGIN"));
}
