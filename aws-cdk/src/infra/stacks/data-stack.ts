import { Stack } from "aws-cdk-lib";
import {
  Table as DynamoTable,
  AttributeType,
  ProjectionType,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../util";

import { type StackProps } from "aws-cdk-lib";
import { type ITable } from "aws-cdk-lib/aws-dynamodb";

interface DataStackProps extends StackProps {
  tableNamePrefix: string;
}
export class DataStack extends Stack {
  public readonly shortnerTable: ITable;

  constructor(scope: Construct, id: string, props: DataStackProps) {
    super(scope, id, props);

    const prefix = props.tableNamePrefix;
    const suffix = getSuffixFromStack(this);

    const table = new DynamoTable(this, "ShortnerTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `${prefix}-${suffix}`,
    });

    table.addGlobalSecondaryIndex({
      indexName: "hashIndex",
      partitionKey: { name: "hash", type: AttributeType.STRING },
      projectionType: ProjectionType.INCLUDE,
      nonKeyAttributes: ["originalUrl"],
    });

    this.shortnerTable = table;
  }
}
