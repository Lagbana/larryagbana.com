import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { UserPool, UserPoolClient, Mfa } from "aws-cdk-lib/aws-cognito";

export class AuthStack extends Stack {
  #userPool: UserPool;
  #userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.#createUserPool();
    this.#createUserPoolClient();
  }

  #createUserPool() {
    this.#userPool = new UserPool(this, "SpaceUserPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
      mfa: Mfa.OFF,
    });

    new CfnOutput(this, "SpaceUserPoolId", {
      value: this.#userPool.userPoolId,
    });
  }
  #createUserPoolClient() {
    this.#userPoolClient = this.#userPool.addClient("SpaceUserPoolClient", {
      idTokenValidity: Duration.minutes(60),
      accessTokenValidity: Duration.minutes(15),
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });

    CfnOutput(this, "SpaceUserPoolClientId", {
      value: this.#userPoolClient.userPoolClientId,
    });
  }
}
