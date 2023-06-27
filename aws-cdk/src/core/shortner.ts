import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  QueryCommandOutput,
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

    const params = {
      TableName: tableName,
      IndexName: "hashIndex",
      KeyConditionExpression: "hash = :h",
      ExpressionAttributeValues: {
        ":h": { S: urlId },
      },
    };

    let queryResult: QueryCommandOutput;

    try {
      queryResult = await ddbClient.send(new QueryCommand(params));
    } catch (error) {
      console.error("Error occurred while getting item from DynamoDB:", error);
      throw error;
    }

    if (queryResult.Items && queryResult.Items.length > 0) {
      const unmarshalledItem = unmarshall(queryResult.Items[0]) as UrlRecord;
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
