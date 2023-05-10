import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export async function updateSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (
    event.queryStringParameters &&
    "id" in event.queryStringParameters &&
    event.body
  ) {
    const spaceId = event.queryStringParameters["id"];
    const body = JSON.parse(event.body || "{}");
    const requestBodyKey = Object.keys(body)[0];
    const requestBodyValue = body[requestBodyKey];

    console.log(`spaceId: `, spaceId);
    console.log(`body: `, body);

    const updateResult = await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
        UpdateExpression: "SET #zzNew = :new",
        ExpressionAttributeNames: {
          "#zzNew": requestBodyKey,
        },
        ExpressionAttributeValues: {
          ":new": { S: requestBodyValue },
        },
        ReturnValues: "UPDATED_NEW",
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updateResult.Attributes),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify("Please provide data to update! 🤔"),
  };
}
