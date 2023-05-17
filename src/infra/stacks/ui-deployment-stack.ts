import { CfnOutput, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { getSuffixFromStack } from "../utils";

// *types
import type { StackProps } from "aws-cdk-lib";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

interface UiDeploymentStackProps extends StackProps {}

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: UiDeploymentStackProps) {
    super(scope, id, props);

    // create a suffix to tag all our stacks
    const suffix = getSuffixFromStack(this);

    // Create a new bucket
    const deploymentBucket = new Bucket(this, "UiDeploymentBucket", {
      bucketName: `space-finder--frontend-${suffix}`,
    });

    // Grab path to the frontend build directory
    const uiDirectory = join(__dirname, "..", "..", "..", "client", "dist");

    // Check that the UI directory exists
    if (!existsSync(uiDirectory)) {
      console.warn(
        "The UI directory does not exist. Did you run `npm run build`?"
      );
      return;
    }

    // Deploy the UI to the bucket
    // This will also create a new CloudFront distribution
    new BucketDeployment(this, "SpacesUIDeployment", {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDirectory)],
    });

    // Create an origin with rights to read from the bucket
    const originIdentity = new OriginAccessIdentity(
      this,
      "SpacesOriginAccessIdentity",
      {}
    );
    deploymentBucket.grantRead(originIdentity);

    // This is how CloudFront has the right to read from the bucket
    const distribution = new Distribution(this, "SpacesUIDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity,
        }),
      },
    });

    new CfnOutput(this, "SpaceFinderUrl", {
      value: distribution.distributionDomainName,
    });
  }
}
