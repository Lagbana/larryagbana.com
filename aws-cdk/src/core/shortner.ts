import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  GetItemCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { createdShortenedUrl, generateId } from "./util";
import { APIGatewayProxyResult } from "aws-lambda";
import { getEnvVar } from "../config";

const ddbClient = new DynamoDBClient({});

type UrlRecord = {
  id: string;
  hash: string;
  originalUrl: string;
  shortUrl: string;
};

export class CoreService {
  async createShortenedUrl(
    originalUrl: string
  ): Promise<APIGatewayProxyResult> {
    const shortenedDomain = getEnvVar("SHORTENED_DOMAIN");
    const { hash, shortUrl } = createdShortenedUrl(shortenedDomain);
    const id = generateId(originalUrl);

    const record: UrlRecord = {
      id,
      hash,
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
      if (error.name === "ConditionalCheckFailedException") {
        // record already exists in dynamodb, just return
        return {
          statusCode: 200,
          body: JSON.stringify({ shortenedUrl: record.shortUrl }),
        };
      } else {
        console.error("Error occurred while putting item in DynamoDB:", error);
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
    let getItem: GetItemCommandOutput;

    try {
      getItem = await ddbClient.send(
        new GetItemCommand({
          TableName: tableName,
          Key: {
            hash: { S: urlId },
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
