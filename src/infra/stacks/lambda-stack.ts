import { join } from "path";
import { Stack } from "aws-cdk-lib";
import type { StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { DynamodbOperations } from "./utils";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly spacesLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const spacesLambda = new NodejsFunction(this, "SpacesLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "services", "spaces", "handler.ts"),
      environment: {
        TABLE_NAME: props.spacesTable.tableName,
      },
    });

    spacesLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.spacesTable.tableArn],
        actions: [
          DynamodbOperations.POST,
          DynamodbOperations.PUT,
          DynamodbOperations.GET,
          DynamodbOperations.DELETE,
          DynamodbOperations.SCAN,
        ],
      })
    );

    this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda);
  }
}
