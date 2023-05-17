import { CognitoUser } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";
import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
} from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

// ! Ideally - Client side code
const awsRegion = "us-east-1";
Amplify.configure({
  Auth: {
    region: awsRegion, // ! should be in an env var
    userPoolId: "us-east-1_my2xxZqaG", // ! should be in an env var
    userPoolWebClientId: "61jd7i74uol615ct2sgdbt4r2", // ! should be in an env var
    identityPoolId: "us-east-1:2ead0c44-dc9f-4a52-8eef-69f2492c5b38", // ! should be in an env var
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  async login(username: string, password: string) {
    const result = (await Auth.signIn(username, password)) as CognitoUser;
    return result;
  }

  /**
   * @description This method will generate temporary credentials for the user
   * based on the user's identity pool id (i.e. used to access system resources) and the user's jwt token
   */
  async generateTemporaryCredentials(user: CognitoUser) {
    try {
      const jwtToken = user.getSignInUserSession()?.getIdToken().getJwtToken();
      const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-1_my2xxZqaG`;

      const cognitoIdentity = new CognitoIdentityClient({
        credentials: fromCognitoIdentityPool({
          identityPoolId: "us-east-1:2ead0c44-dc9f-4a52-8eef-69f2492c5b38",
          logins: {
            [cognitoIdentityPool]: jwtToken,
          },
        }),
      });

      const command = new GetCredentialsForIdentityCommand({
        IdentityId: "us-east-1:4350329b-5ca8-4c40-95b6-6edf5421ca92",
        Logins: {
          [cognitoIdentityPool]: jwtToken,
        },
      });
      const credentials = await cognitoIdentity.send(command);
      return credentials;
    } catch (error) {
      console.log(`❌❌❌: `, error);
    }
  }
}
