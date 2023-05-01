import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class PhotoStack extends cdk.Stack {
  private stackSuffix: string;
  public readonly photosBucketArn: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.initializeSuffix();

    const photosBucket = new Bucket(this, "PhotosBucket", {
      bucketName: `photos-bucket-${this.stackSuffix}`,
    });
    this.photosBucketArn = photosBucket.bucketArn;
  }
  private initializeSuffix() {
    const shortSuffix = cdk.Fn.select(2, cdk.Fn.split("/", this.stackId));
    this.stackSuffix = cdk.Fn.select(4, cdk.Fn.split("-", shortSuffix));
  }
}
