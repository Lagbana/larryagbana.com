process.env.COMMIT_HASH = "test_commit_hash";

import { App, Stack } from "aws-cdk-lib";
import {
  Annotations,
  Capture,
  Match,
  MatchCapture,
  MatchFailure,
  MatchResult,
  Matcher,
  Template,
} from "aws-cdk-lib/assertions";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ApiStack } from "../../src/infra/stacks/apiStack";
import { LambdaStack } from "../../src/infra/stacks/lambdaStack";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

describe("Api stack test suite", () => {
  let assert: Template;

  beforeAll(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });
    // const mockLambda = new NodejsFunction(testApp, "ShortnerLambdaStack");
    // const mockLambdaIntegration = new LambdaIntegration(mockLambda);
    const apiStack = new ApiStack(testApp, "ApiStack", {
      lambdaIntegration: null,
      // lambdaIntegration: mockLambdaIntegration,
    });
    assert = Template.fromStack(apiStack);
  });

  test("ApiGateway properties", () => {
    assert.hasResourceProperties("AWS::ApiGateway::RestApi", {
      Name: "UrlShortnerApi",
    });
  });

  test("ApiGateway has correct iam permissions", () => {
    const roleCapture = new Capture();
    assert.hasResourceProperties("AWS::IAM::Role", {
      AssumeRolePolicyDocument: Match.objectLike({
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
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
      roleCapture.asString().match(/AmazonAPIGatewayPushToCloudWatchLogs/)
    ).not.toBeNull();
  });

  test("Lambda integration", () => {
    assert.toJSON();
    // assert.hasResourceProperties("AWS::Lambda::Permission", {
    //   // Vpc: Match.absent(),
    // });
  });
});
