import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

export async function createSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const randomId = uuidv4();
  const item = JSON.parse(event.body || "{}"); // may or not be valid JSON
  item.id = randomId;

  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        id: { S: randomId },
        location: { S: item.location },
      },
    })
  );

  console.log(`result: `, result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomId }),
  };
}
