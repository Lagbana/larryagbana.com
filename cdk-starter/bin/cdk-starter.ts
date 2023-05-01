#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PhotoStack } from "../lib/photo-stack";
import { PhotosHandlerStack } from "../lib/photos-handler";

const app = new cdk.App();
const photosStack = new PhotoStack(app, "PhotoStack");
new PhotosHandlerStack(app, "PhotosHandlerStack", {
  targetBucketArn: photosStack.photosBucketArn,
});
