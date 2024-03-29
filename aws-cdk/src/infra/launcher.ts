import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/api-stack";
import { LambdaStack } from "./stacks/lambda-stack";
import { DataStack } from "./stacks/data-stack";
import { UiDeploymentStack } from "./stacks/ui-deployment-stack";
import { getEnvVar } from "../config";

const app = new App();

const dataStack = new DataStack(app, "ShortnerDataStack", {
  tableNamePrefix: getEnvVar("SHORTNER_TABLE_PREFIX"),
});
const lambdaStack = new LambdaStack(app, "ShortnerLambdaStack", {
  shortnerTable: dataStack.shortnerTable,
  shortnerBaseUrl: getEnvVar("SHORTNER_BASE_URL"),
  corsOrigin: getEnvVar("CORS_ORIGIN"),
});
new ApiStack(app, "ShortnerApiStack", {
  lambdaIntegration: lambdaStack.lambdaIntegration,
  version: getEnvVar("COMMIT_HASH"),
});
new UiDeploymentStack(app, "ShortnerUIDeploymentStack");
