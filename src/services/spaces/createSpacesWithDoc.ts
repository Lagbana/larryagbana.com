import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createRandomId, parseJSON } from "../../utils";

export async function createSpacesWithDoc(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
  const randomId = createRandomId();
  const item = parseJSON(event.body);
  item.id = randomId;

  await ddbDocClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: item,
    })
  );

  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomId }),
  };
}
