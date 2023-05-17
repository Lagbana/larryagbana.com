import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { hasAdminGroup } from "../../infra/stacks/utils";

export async function deleteSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (!hasAdminGroup(event)) {
    return {
      statusCode: 403,
      body: JSON.stringify(`Forbidden!`),
    };
  }

  if (event.queryStringParameters && "id" in event.queryStringParameters) {
    const spaceId = event.queryStringParameters.id;

    await ddbClient.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(`deleted space with id: ${spaceId}`),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify(`Please provide the right args`),
  };
}
