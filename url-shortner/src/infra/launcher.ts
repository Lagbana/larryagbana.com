import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/ApiStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { DataStack } from "./stacks/DataStack";
import { VERSION } from "../config";

const app = new App();

const dataStack = new DataStack(app, "ShortnerDataStack");
const lambdaStack = new LambdaStack(app, "ShortnerLambdaStack", {
  shortnerTable: dataStack.shortnerTable,
});
new ApiStack(app, "ShortnerApiStack", {
  lambdaIntegration: lambdaStack.lambdaIntegration,
  version: VERSION,
});
