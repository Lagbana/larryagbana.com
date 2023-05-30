import { Stack } from "aws-cdk-lib";
import {
  RestApi,
  LambdaIntegration,
  ResourceOptions,
  Cors,
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
        allowOrigins: Cors.ALL_ORIGINS, // TODO this is the default - we should restrict this to specific origins
        allowMethods: Cors.ALL_METHODS, // TODO this is the default - we should restrict this to specific origins
      },
    };

    const apiResource = api.root.addResource("shortner", optionsWithCors);

    apiResource.addMethod("GET", props.lambdaIntegration);
    apiResource.addMethod("POST", props.lambdaIntegration);
  }
}
