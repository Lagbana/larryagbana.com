import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  DeleteItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import { captureAWSv3Client, getSegment } from "aws-xray-sdk-core";
import { Space } from "../../entities";
import { SpacesRepository } from "./spaces.interface";

export class DynamoDBSpacesRepository implements SpacesRepository {
  private client: DynamoDBClient;

  constructor() {
    // Enable tracing on dynamodb using X-Ray
    this.client = captureAWSv3Client(new DynamoDBClient({}));
  }

  async get(spaceId: string): Promise<Space | null> {
    const getItem = await this.client.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
      })
    );

    if (getItem.Item) {
      const umarshalledItem = unmarshall(getItem.Item) as Space;
      return umarshalledItem;
    }

    return null;
  }

  async getAll(): Promise<Array<Space>> {
    const getAllSpacesTrace =
      getSegment().addNewSubsegment("getAllSpacesTrace");
    const result = await this.client.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME,
      })
    );
    getAllSpacesTrace.close();

    const unmarshalling = getSegment().addNewSubsegment("unmarshalling");
    const umarshalledItems = result.Items?.map(
      (item) => unmarshall(item) as Space
    );
    unmarshalling.close();

    // convert result to array of Space and return
    return umarshalledItems;
  }

  async create(space: Space) {
    await this.client.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(space),
      })
    );

    return space.id;
  }

  async update(spaceId: string, space: Partial<Space>) {
    // Build the update expression and attribute values
    let updateExpression = "SET ";
    let expressionAttributeNames: { [key: string]: string } = {};
    let expressionAttributeValues: { [key: string]: { S: string } };

    for (const [key, value] of Object.entries(space)) {
      // Skip if the attribute is 'id'
      if (key === "id") {
        continue;
      }

      const attrValueKey = ":" + key;
      // Add a unique prefix or suffix to the placeholder for the attribute name
      const attrNameKey = "#attr_" + key;

      updateExpression += `${attrNameKey} = ${attrValueKey}, `;
      expressionAttributeNames[attrNameKey] = key;
      expressionAttributeValues[attrValueKey] = { S: value };
    }

    // Remove the trailing comma and space from the update expression
    updateExpression = updateExpression.slice(0, -2);

    const updateOutput = await this.client.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
    );

    const updatedSpace = unmarshall(updateOutput.Attributes) as Space;

    return updatedSpace;
  }

  async delete(spaceId: string) {
    await this.client.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
      })
    );
    return "Deleted.";
  }
}
