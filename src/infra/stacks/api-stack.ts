import { Stack } from "aws-cdk-lib";
import type { StackProps } from "aws-cdk-lib";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface APiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: APiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "SpaceFinderApi", {});
    const spacesResource = api.root.addResource("spaces");
    spacesResource.addMethod("GET", props.spacesLambdaIntegration);
    spacesResource.addMethod("POST", props.spacesLambdaIntegration);
  }
}
