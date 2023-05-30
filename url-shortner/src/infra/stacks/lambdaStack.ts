import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

import { DynamodbOperations } from "../util";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface LambdaStackProps extends StackProps {
  shortnerTable: ITable;
}
export class LambdaStack extends Stack {
  public readonly lambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const shortnerLambda = new NodejsFunction(this, "ShortnerLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "controller", "handler.ts"),
      environment: {
        TABLE_NAME: props.shortnerTable.tableName,
      },
    });

    shortnerLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.shortnerTable.tableArn],
        actions: [
          DynamodbOperations.GET,
          DynamodbOperations.SCAN,
          DynamodbOperations.POST,
        ],
      })
    );

    this.lambdaIntegration = new LambdaIntegration(shortnerLambda);
  }
}
