import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export async function createSpacesWithDoc(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
  const randomId = uuidv4();
  const item = JSON.parse(event.body || "{}");
  item.id = randomId;

  const result = await ddbDocClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: item,
    })
  );

  console.log(`result: `, result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomId }),
  };
}
