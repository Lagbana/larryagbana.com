import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  UserPool,
  UserPoolClient,
  Mfa,
  CfnUserPoolGroup,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
} from "aws-cdk-lib/aws-cognito";
import { FederatedPrincipal, Role } from "aws-cdk-lib/aws-iam";

export class AuthStack extends Stack {
  public userPool: UserPool;
  #userPoolClient: UserPoolClient;
  #identityPool: CfnIdentityPool;
  #authenticatedRole: Role;
  #unAuthenticatedRole: Role;
  #adminRole: Role;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.#createUserPool();
    this.#createUserPoolClient();
    this.#createAdminGroup();
    this.#createIdentityPool();
    this.#createRoles();
    this.#attachRoles();
  }

  #createUserPool() {
    this.userPool = new UserPool(this, "SpaceUserPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
      mfa: Mfa.OFF,
    });

    new CfnOutput(this, "SpaceUserPoolId", {
      value: this.userPool.userPoolId,
    });
  }
  #createUserPoolClient() {
    this.#userPoolClient = this.userPool.addClient("SpaceUserPoolClient", {
      // idTokenValidity: Duration.minutes(60),
      // accessTokenValidity: Duration.minutes(15),
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });

    new CfnOutput(this, "SpaceUserPoolClientId", {
      value: this.#userPoolClient.userPoolClientId,
    });
  }
  #createAdminGroup() {
    new CfnUserPoolGroup(this, "SpaceAdmins", {
      userPoolId: this.userPool.userPoolId,
      groupName: "admins",
    });
  }
  #createIdentityPool() {
    this.#identityPool = new CfnIdentityPool(this, "SpaceIdentityPool", {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: this.#userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });
    new CfnOutput(this, "SpaceIdentityPoolId", {
      value: this.#identityPool.ref,
    });
  }
  #createRoles() {
    this.#authenticatedRole = new Role(
      this,
      "CognitoDefaultAuthenticatedRole",
      {
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.#identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "authenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );
    this.#unAuthenticatedRole = new Role(
      this,
      "CognitoDefaultUnauthenticatedRole",
      {
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.#identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "unauthenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );
    this.#adminRole = new Role(this, "CognitoAdminRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.#identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
  }
  #attachRoles() {
    new CfnIdentityPoolRoleAttachment(this, "RolesAttachment", {
      identityPoolId: this.#identityPool.ref,
      roles: {
        authenticated: this.#authenticatedRole.roleArn,
        unauthenticated: this.#unAuthenticatedRole.roleArn,
      },
      roleMappings: {
        admins: {
          type: "Token",
          ambiguousRoleResolution: "AuthenticatedRole",
          identityProvider: `${this.userPool.userPoolProviderName}:${
            this.#userPoolClient.userPoolClientId
          }`,
        },
      },
    });
  }
}
