import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/apiStack";
import { LambdaStack } from "./stacks/lambdaStack";
import { DataStack } from "./stacks/dataStack";

const app = new App();

const dataStack = new DataStack(app, "DataStack");
const lambdaStack = new LambdaStack(app, "LambdaStack", {
  shortnerTable: dataStack.shortnerTable,
});
new ApiStack(app, "ApiStack", {
  lambdaIntegration: lambdaStack.lambdaIntegration,
});
