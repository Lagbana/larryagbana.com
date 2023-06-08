import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/apiStack";
import { LambdaStack } from "./stacks/lambdaStack";
import { DataStack } from "./stacks/dataStack";
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
