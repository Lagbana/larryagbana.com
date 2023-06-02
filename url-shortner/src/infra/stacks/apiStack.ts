import { CfnOutput, Stack } from "aws-cdk-lib";
import {
  RestApi,
  LambdaIntegration,
  ResourceOptions,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

import { type StackProps } from "aws-cdk-lib";

interface ApiStackProps extends StackProps {
  lambdaIntegration: LambdaIntegration;
}
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "UrlShortnerApi");

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: ["http://localhost:3000"],
        allowMethods: ["GET", "POST"],
      },
    };

    const apiResource = api.root.addResource("shortner", optionsWithCors);

    apiResource.addMethod("GET", props.lambdaIntegration);
    apiResource.addMethod("POST", props.lambdaIntegration);

    new CfnOutput(this, "ShortnerApiEndpoint", {
      value: api.url,
    });

    new CfnOutput(this, "Version", {
      value: process.env.COMMIT_HASH,
    });
  }
}
