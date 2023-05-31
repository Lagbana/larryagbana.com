import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { createdShortenedUrl, createBase64Url } from "./util";
import { APIGatewayProxyResult } from "aws-lambda";

const SHORTNER_BASE_URL = process.env.SHORTNER_BASE_URL;
const ddbClient = new DynamoDBClient({});

type UrlRecord = Record<string, { originalUrl: string; shortenedUrl: string }>;

export class CoreService {
  async createShortenedUrl(
    originalUrl: string
  ): Promise<APIGatewayProxyResult> {
    const base64Url = createBase64Url(originalUrl);

    const previousRecord = await this.#getShortenedUrl(base64Url);

    if (previousRecord) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          shortenedUrl: previousRecord[base64Url].shortenedUrl,
        }),
      };
    }

    const shortenedUrl = createdShortenedUrl(base64Url, SHORTNER_BASE_URL);

    const record: UrlRecord = {
      [base64Url]: {
        originalUrl,
        shortenedUrl,
      },
    };

    ddbClient.send(
      new PutItemCommand({
        TableName: process.env.SHORTNER_TABLE_NAME,
        Item: marshall(record),
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ shortenedUrl: record[base64Url].shortenedUrl }),
    };
  }

  async #getShortenedUrl(base64Url: string): Promise<UrlRecord | null> {
    const getItem = await ddbClient.send(
      new GetItemCommand({
        TableName: process.env.SHORTNER_TABLE_NAME,
        Key: {
          id: { S: base64Url },
        },
      })
    );

    if (getItem.Item) {
      const umarshalledItem = unmarshall(getItem.Item) as UrlRecord;
      return umarshalledItem;
    }

    return null;
  }
}
