import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  GetItemCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { createdShortenedUrl } from "./util";
import { APIGatewayProxyResult } from "aws-lambda";
import { getEnvVar } from "../config";

const ddbClient = new DynamoDBClient({});

type UrlRecord = {
  id: string;
  originalUrl: string;
  shortUrl: string;
};

export class CoreService {
  async createShortenedUrl(
    originalUrl: string,
    requestId: string
  ): Promise<APIGatewayProxyResult> {
    const shortenedDomain = getEnvVar("SHORTENED_DOMAIN");
    const { urlPath, shortUrl } = createdShortenedUrl(
      shortenedDomain,
      requestId
    );

    const record: UrlRecord = {
      id: urlPath,
      originalUrl,
      shortUrl,
    };

    const tableName = getEnvVar("SHORTNER_TABLE_NAME");
    try {
      await ddbClient.send(
        new PutItemCommand({
          TableName: tableName,
          Item: marshall(record),
        })
      );
    } catch (error) {
      console.error("Error occurred while putting item in DynamoDB:", error);
      throw error;
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ shortenedUrl: record.shortUrl }),
    };
  }

  async getOriginalUrl(urlId: string): Promise<APIGatewayProxyResult> {
    const tableName = getEnvVar("SHORTNER_TABLE_NAME");

    let getItem: GetItemCommandOutput;

    try {
      getItem = await ddbClient.send(
        new GetItemCommand({
          TableName: tableName,
          Key: {
            id: { S: urlId },
          },
        })
      );
    } catch (error) {
      console.error("Error occurred while getting item from DynamoDB:", error);
      throw error;
    }

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
      statusCode: 404,
      body: "Not found: Invalid URL!",
    };
  }
}
