import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/api-stack";
import { LambdaStack } from "./stacks/lambda-stack";
import { DataStack } from "./stacks/data-stack";
import { UiDeploymentStack } from "./stacks/ui-deployment-stack";
import { getEnvVar } from "../config";

const app = new App();

const dataStack = new DataStack(app, "ShortnerDataStack");
const lambdaStack = new LambdaStack(app, "ShortnerLambdaStack", {
  shortnerTable: dataStack.shortnerTable,
});
new ApiStack(app, "ShortnerApiStack", {
  lambdaIntegration: lambdaStack.lambdaIntegration,
  version: getEnvVar("COMMIT_HASH"),
});
new UiDeploymentStack(app, "ShortnerUIDeploymentStack");
