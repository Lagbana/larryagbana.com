import { App, Aspects } from "aws-cdk-lib";
// import { AwsSolutionsChecks } from "cdk-nag"; // TODO: Perform CDK NAG checks to ensure the app is following AWS best practices
import { DataStack } from "./stacks/data-stack";
import { LambdaStack } from "./stacks/lambda-stack";
import { ApiStack } from "./stacks/api-stack";
import { AuthStack } from "./stacks/auth-stack";
import { UiDeploymentStack } from "./stacks/ui-deployment-stack";
import { BucketTagger } from "./tagger";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const authStack = new AuthStack(app, "AuthStack", {
  photosBucket: dataStack.photosBucket,
});
const lambdaStack = new LambdaStack(app, "LambdaStack", {
  spacesTable: dataStack.spacesTable,
});
new ApiStack(app, "ApiStack", {
  spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration,
  userPool: authStack.userPool,
});
new UiDeploymentStack(app, "UiDeploymentStack");

const bucketTag = new BucketTagger("version", "0.0.1");
Aspects.of(app).add(bucketTag);

// TODO: Perform CDK NAG checks to ensure the app is following AWS best practices
// Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
