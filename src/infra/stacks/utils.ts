const databaseOperations = {
  DELETE: "dynamodb:DeleteItem",
  GET: "dynamodb:GetItem",
  POST: "dynamodb:PutItem",
  PUT: "dynamodb:UpdateItem",
  SCAN: "dynamodb:Scan",
};

export const DynamodbOperations = Object.preventExtensions(databaseOperations);
