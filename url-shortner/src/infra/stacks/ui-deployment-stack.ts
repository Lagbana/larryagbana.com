import { CfnOutput, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { getSuffixFromStack } from "../util";

import type { StackProps } from "aws-cdk-lib";

interface UIDeploymentStackProps extends StackProps {}

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: UIDeploymentStackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    const deploymentBucket = new Bucket(this, "ShortnerClientBucket", {
      bucketName: `shortner-client-${suffix}`,
    });

    const uiDirectory = join(__dirname, "..", "..", "..", "client", "build");

    if (!existsSync(uiDirectory)) {
      console.warn(
        "❌ The UI directory does not exist. Did you run `npm run build`?"
      );
      return;
    }

    // Deploy UI to bucket, also creates a new CloudFront distribution
    new BucketDeployment(this, "ShortnerUIDeployment", {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDirectory)],
    });

    // Create an origin identity
    const originIdentity = new OriginAccessIdentity(
      this,
      "ShortnerOriginAccessIdentity",
      {}
    );

    // Grant read permissions for this bucket to an IAM principal (Role/Group/User)
    // i.e. the origin identity
    deploymentBucket.grantRead(originIdentity);

    // Establish the cloudfront distribution as the origin identity
    // permitted to read from the bucket
    const distribution = new Distribution(this, "ShortnerUiDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity,
        }),
      },
    });

    new CfnOutput(this, "ShortnerUrl", {
      value: distribution.distributionDomainName,
    });
  }
}
