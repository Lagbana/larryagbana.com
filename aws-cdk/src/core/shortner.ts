import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { createdShortenedUrl, createBase64Url } from "./util";
import { APIGatewayProxyResult } from "aws-lambda";
import { getEnvVar } from "../config";

const ddbClient = new DynamoDBClient({});

type UrlRecord = { id: string; originalUrl: string; shortUrl: string };

export class CoreService {
  async createShortenedUrl(
    originalUrl: string
  ): Promise<APIGatewayProxyResult> {
    const base64Url = createBase64Url(originalUrl);

    const { id, shortUrl } = createdShortenedUrl(
      base64Url,
      getEnvVar("SHORTNER_BASE_URL")
    );

    const record: UrlRecord = {
      id,
      originalUrl,
      shortUrl,
    };

    try {
      const tableName = getEnvVar("SHORTNER_TABLE_NAME");
      await ddbClient.send(
        new PutItemCommand({
          TableName: tableName,
          Item: marshall(record),
          ConditionExpression: "attribute_not_exists(id)",
        })
      );
    } catch (error) {
      console.error("Error occurred while putting item in DynamoDB:", error);

      if (error.name === "ConditionalCheckFailedException") {
        // record already exists in dynamodb, just return
        return {
          statusCode: 200,
          body: JSON.stringify({ shortenedUrl: record.shortUrl }),
        };
      } else {
        throw error;
      }
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ shortenedUrl: record.shortUrl }),
    };
  }

  async getOriginalUrl(urlId: string): Promise<APIGatewayProxyResult> {
    const tableName = getEnvVar("SHORTNER_TABLE_NAME");

    const getItem = await ddbClient.send(
      new GetItemCommand({
        TableName: tableName,
        Key: {
          id: { S: urlId },
        },
      })
    );

    if (getItem.Item) {
      const unmarshalledItem = unmarshall(getItem.Item) as UrlRecord;
      const originalUrl = unmarshalledItem.originalUrl;

      return {
        statusCode: 301,
        headers: {
          Location: originalUrl,
        },
        body: "",
      };
    }
    return {
      statusCode: 400,
      body: "Bad request: Invalid URL.",
    };
  }
}
