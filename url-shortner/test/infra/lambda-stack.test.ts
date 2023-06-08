import { App } from "aws-cdk-lib";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";
import { LambdaStack } from "../../src/infra/stacks/lambda-stack";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

const MOCK_TABLE = {
  tableArn: "mock_arn",
  tableName: "mock_table_name",
} as ITable;

describe("LambdaStack", () => {
  let assert: Template;

  beforeAll(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });
    const mockLambdaStack = new LambdaStack(testApp, "MockLambdaStack", {
      shortnerTable: MOCK_TABLE,
    });

    assert = Template.fromStack(mockLambdaStack);
  });

  test("lambda resource was created", () => {
    assert.resourceCountIs("AWS::Lambda::Function", 1);
  });

  test("lambda function has correct properties", () => {
    const dependencyCapture = new Capture();
    assert.hasResource("AWS::Lambda::Function", {
      DependsOn: [dependencyCapture, dependencyCapture],
      Properties: {
        Code: {
          S3Bucket: Match.anyValue(),
          S3Key: Match.anyValue(),
        },
        Handler: "index.handler",
        Runtime: "nodejs18.x",
        Timeout: 5,
      },
    });

    expect(
      dependencyCapture.asString().match(/ShortnerLambdaServiceRole/)
    ).not.toBeNull();
  });

  test("lambda has correct iam permissions", () => {
    const roleCapture = new Capture();
    assert.hasResourceProperties("AWS::IAM::Role", {
      AssumeRolePolicyDocument: Match.objectLike({
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
          },
        ],
      }),
      ManagedPolicyArns: [
        {
          "Fn::Join": Match.arrayWith([
            ["arn:", { Ref: "AWS::Partition" }, roleCapture],
          ]),
        },
      ],
    });

    expect(
      roleCapture.asString().match(/AWSLambdaBasicExecutionRole/)
    ).not.toBeNull();
  });
});
