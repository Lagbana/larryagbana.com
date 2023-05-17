import { Stack } from "aws-cdk-lib";
import {
  RestApi,
  LambdaIntegration,
  CognitoUserPoolsAuthorizer,
  AuthorizationType,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

// *types
import type { StackProps } from "aws-cdk-lib";
import type { MethodOptions } from "aws-cdk-lib/aws-apigateway";
import type { IUserPool } from "aws-cdk-lib/aws-cognito";

interface APiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: APiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "SpaceFinderApi");
    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "SpaceApiAuthorizer",
      {
        cognitoUserPools: [props.userPool], // all the user pools that can access this specific API
        identitySource: "method.request.header.Authorization", // the location of the Authorization header
      }
    );

    authorizer._attachToApi(api); // this attach the authorizer to the API layer

    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };

    const spacesResource = api.root.addResource("spaces");
    spacesResource.addMethod(
      "GET",
      props.spacesLambdaIntegration,
      optionsWithAuth
    );
    spacesResource.addMethod(
      "PUT",
      props.spacesLambdaIntegration,
      optionsWithAuth
    );
    spacesResource.addMethod(
      "POST",
      props.spacesLambdaIntegration,
      optionsWithAuth
    );
    spacesResource.addMethod(
      "DELETE",
      props.spacesLambdaIntegration,
      optionsWithAuth
    );
  }
}
