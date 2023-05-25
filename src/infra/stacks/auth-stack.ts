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
import {
  Effect,
  FederatedPrincipal,
  PolicyStatement,
  Role,
} from "aws-cdk-lib/aws-iam";
import type { IBucket } from "aws-cdk-lib/aws-s3";

interface AuthStackProps extends StackProps {
  photosBucket: IBucket; // Use to setup permissions for the photosbucket
}

export class AuthStack extends Stack {
  public userPool: UserPool;
  #userPoolClient: UserPoolClient;
  #identityPool: CfnIdentityPool;
  #authenticatedRole: Role;
  #unAuthenticatedRole: Role;
  #adminRole: Role;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);
    this.#createUserPool();
    this.#createUserPoolClient();
    this.#createIdentityPool();
    this.#createRoles(props.photosBucket);
    this.#attachRoles();
    this.#createAdminGroup(); // should be done after the roles are created
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
      roleArn: this.#adminRole.roleArn, // establish the role that will be assumed by the users in this group
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
  #createRoles(photosBucket: IBucket) {
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

    // * Test that the admin role is working
    // * by adding a policy statement to the admin role to allow listing of buckets
    this.#adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:PutObject", "s3:PutObjectAcl"],
        resources: [photosBucket.bucketArn + "/*"],
      })
    );
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
