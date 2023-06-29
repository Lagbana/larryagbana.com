import { APIGatewayProxyResult } from "aws-lambda";

export function responseWithCorsHeaders(
  response: APIGatewayProxyResult,
  origin: string
): APIGatewayProxyResult {
  if (response.statusCode === 301) {
    return response;
  }

  return {
    ...response,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": true,
      ...(response.headers || {}),
    },
  };
}
