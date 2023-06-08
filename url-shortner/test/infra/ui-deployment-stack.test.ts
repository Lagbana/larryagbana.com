import { App } from "aws-cdk-lib";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";
import { UiDeploymentStack } from "../../src/infra/stacks/ui-deployment-stack";

describe("UiDeploymentStack", () => {
  let assert: Template;

  beforeAll(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });

    const mockUiDeploymentStack = new UiDeploymentStack(
      testApp,
      "UiDeploymentStack"
    );

    assert = Template.fromStack(mockUiDeploymentStack);
  });

  test("deployment bucket was created", () => {
    const bucketPolicyCapture = new Capture();

    assert.resourceCountIs("AWS::S3::Bucket", 1);

    assert.hasResourceProperties("AWS::S3::BucketPolicy", {
      Bucket: bucketPolicyCapture,
    });

    expect(bucketPolicyCapture.asObject()).toEqual({
      Ref: expect.stringMatching(/^ShortnerClientBucket/),
    });
  });

  test("deployment has correct iam permissions", () => {
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

  test("CloudFront origin identity was created", () => {
    assert.resourceCountIs(
      "AWS::CloudFront::CloudFrontOriginAccessIdentity",
      1
    );
  });

  test("CloudFront distribution was created", () => {
    const originCapture = new Capture();
    const accessIdentityCapture = new Capture();

    assert.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        Enabled: true,
        IPV6Enabled: true,
        Origins: [
          {
            DomainName: {
              "Fn::GetAtt": originCapture,
            },
            S3OriginConfig: {
              OriginAccessIdentity: {
                "Fn::Join": [
                  "",
                  ["origin-access-identity/cloudfront/", accessIdentityCapture],
                ],
              },
            },
          },
        ],
      },
    });

    expect(
      originCapture.asArray().includes(/ShortnerClientBucket/)
    ).not.toBeNull();

    expect(accessIdentityCapture.asObject()).toEqual({
      Ref: expect.stringMatching(/^ShortnerOriginAccessIdentity/),
    });

    assert.hasOutput("ShortnerUrl", {});
  });
});
