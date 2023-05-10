import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters) {
    if ("id" in event.queryStringParameters) {
      const spaceId = event.queryStringParameters.id;
      const getItem = await ddbClient.send(
        new GetItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: { S: spaceId },
          },
        })
      );

      if (getItem.Item) {
        const umarshalledItem = unmarshall(getItem.Item);
        return {
          statusCode: 200,
          body: JSON.stringify(umarshalledItem),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: `Space with id: ${spaceId} not Found`,
          }),
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Bad Request: id is required",
        }),
      };
    }
  }

  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );

  console.log(`result: `, result.Items);

  const umarshalledItems = result.Items?.map((item) => unmarshall(item));

  return {
    statusCode: 200,
    body: JSON.stringify(umarshalledItems),
  };
}
