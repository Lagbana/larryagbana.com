import { CfnOutput, Stack } from "aws-cdk-lib";
import { Table as DynamoTable, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../utils";
import {
  Bucket,
  HttpMethods,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";

// *types
import type { StackProps } from "aws-cdk-lib";
import type { IBucket } from "aws-cdk-lib/aws-s3";
import type { ITable } from "aws-cdk-lib/aws-dynamodb";

export class DataStack extends Stack {
  public readonly spacesTable: ITable;
  public readonly photosBucket: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    this.spacesTable = new DynamoTable(this, "SpacesTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `SpacesTable-${suffix}`,
    });

    this.photosBucket = new Bucket(this, "SpacesPhotosBucket", {
      bucketName: `space-photos-bucket-${suffix}`,
      cors: [
        {
          allowedMethods: [HttpMethods.HEAD, HttpMethods.PUT],
          allowedOrigins: ["*"], // ! Update with the actual client origin
          allowedHeaders: ["*"], // ! Update with the actual client origin
        },
      ],
      // * @read: https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html
      // accessControl: BucketAccessControl.PUBLIC_READ, // * Ideal but currently not working
      objectOwnership: ObjectOwnership.OBJECT_WRITER, // * work around
      blockPublicAccess: {
        // * work around
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });

    new CfnOutput(this, "SpacePhotosBucketName", {
      value: this.photosBucket.bucketName,
    });
  }
}
