import { Stack } from "aws-cdk-lib";
import { Table as DynamoTable, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../util";
import { getEnvVar } from "../../config";

import { type StackProps } from "aws-cdk-lib";
import { type ITable } from "aws-cdk-lib/aws-dynamodb";

export class DataStack extends Stack {
  public readonly shortnerTable: ITable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const prefix = getEnvVar("SHORTNER_TABLE_PREFIX");
    const suffix = getSuffixFromStack(this);

    this.shortnerTable = new DynamoTable(this, "ShortnerTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `${prefix}-${suffix}`,
    });
  }
}
