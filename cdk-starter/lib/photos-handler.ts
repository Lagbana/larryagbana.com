import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Function as LambdaFunction,
  Runtime,
  Code,
} from "aws-cdk-lib/aws-lambda";

interface PhotosHandlerStackProps extends cdk.StackProps {
  readonly targetBucketArn: string;
}

export class PhotosHandlerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PhotosHandlerStackProps) {
    super(scope, id, props);

    new LambdaFunction(this, "Photos-Lambda", {
      handler: "index.handler",
      description: "A lambda function that processes photos",
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromInline(`
        exports.handler = async function(event) {
            console.log("hello there!: " + process.env.TARGET_BUCKET);
        };
    `),
      environment: {
        TARGET_BUCKET: props.targetBucketArn,
      },
    });
  }
}
