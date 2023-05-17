import { APIGatewayProxyEvent } from "aws-lambda";

const databaseOperations = {
  DELETE: "dynamodb:DeleteItem",
  GET: "dynamodb:GetItem",
  POST: "dynamodb:PutItem",
  PUT: "dynamodb:UpdateItem",
  SCAN: "dynamodb:Scan",
};

export const DynamodbOperations = Object.preventExtensions(databaseOperations);

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims["cognito:groups"];

  if (groups) {
    return (groups as string).includes("admins");
  }
  return false;
}
