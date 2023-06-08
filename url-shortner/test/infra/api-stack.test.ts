import { App, Stack } from "aws-cdk-lib";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ApiStack } from "../../src/infra/stacks/api-stack";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";

describe("ApiStack", () => {
  let assert: Template;

  beforeAll(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });

    const mockLambdaStack = new Stack(testApp, "MockLambdaStack");
    const mockLambda = new LambdaFunction(mockLambdaStack, "MockLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: Code.fromInline(
        "exports.handler = function(event, ctx, cb) { return cb(null, 'hi'); }"
      ),
    });
    const mockLambdaIntegration = new LambdaIntegration(mockLambda);
    const apiStack = new ApiStack(testApp, "ApiStack", {
      lambdaIntegration: mockLambdaIntegration,
      version: "test_commit_hash",
    });

    assert = Template.fromStack(apiStack);
  });

  test("ApiGateway properties", () => {
    // Assert a RestApi is created
    assert.hasResourceProperties("AWS::ApiGateway::RestApi", {
      Name: "UrlShortnerApi",
    });

    // Assert CORS is set up correctly
    assert.resourcePropertiesCountIs(
      "AWS::ApiGateway::Method",
      {
        HttpMethod: "OPTIONS",
        Integration: {
          IntegrationResponses: [
            {
              ResponseParameters: {
                "method.response.header.Access-Control-Allow-Headers":
                  "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                "method.response.header.Access-Control-Allow-Origin":
                  "'http://localhost:3000'",
                "method.response.header.Vary": "'Origin'",
                "method.response.header.Access-Control-Allow-Methods":
                  "'GET,POST'",
              },
              StatusCode: "204",
            },
          ],
        },
        MethodResponses: [
          {
            ResponseParameters: {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Vary": true,
              "method.response.header.Access-Control-Allow-Methods": true,
            },
            StatusCode: "204",
          },
        ],
      },
      1
    );

    // Assert GET and POST methods are set up
    assert.resourcePropertiesCountIs(
      "AWS::ApiGateway::Method",
      {
        Integration: Match.objectLike({
          Type: "AWS_PROXY",
          Uri: { "Fn::Join": Match.anyValue() },
        }),
      },
      2
    );

    assert.hasOutput("ShortnerApiEndpoint", {});
    assert.hasOutput("Version", {
      Value: "test_commit_hash",
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
    assert.resourcePropertiesCountIs(
      "AWS::Lambda::Permission",
      {
        Action: "lambda:InvokeFunction",
        Principal: "apigateway.amazonaws.com",
      },
      4
    );
  });
});
