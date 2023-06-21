import { CfnOutput, Stack } from "aws-cdk-lib";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

import { type StackProps } from "aws-cdk-lib";

interface ApiStackProps extends StackProps {
  lambdaIntegration: LambdaIntegration;
  version: string;
}
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "UrlShortnerApi");
    api.root.addCorsPreflight({
      allowOrigins: [
        "http://localhost:3000",
        "https://d218ploksh8jta.cloudfront.net",
      ],
      allowMethods: ["GET", "POST"],
    });
    api.root.addMethod("GET", props.lambdaIntegration);
    api.root.addMethod("POST", props.lambdaIntegration);

    new CfnOutput(this, "ShortnerApiEndpoint", {
      value: api.url,
    });

    new CfnOutput(this, "Version", {
      value: props.version,
    });
  }
}
