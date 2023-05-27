import { Auth } from "@aws-amplify/auth";
import { type CognitoUser } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { AuthStack } from "../../../outputs.json";
import { AwsCredentialIdentity } from "@aws-sdk/types";

const awsRegion = "us-east-1";

Auth.configure({
  mandatorySignIn: false,
  region: awsRegion,
  userPoolId: AuthStack.SpaceUserPoolId,
  userPoolWebClientId: AuthStack.SpaceUserPoolClientId,
  identityPoolId: AuthStack.SpaceIdentityPoolId,
  authenticationFlowType: "USER_PASSWORD_AUTH",
});

export class AuthService {
  #user?: CognitoUser;
  #jwtToken?: string;
  #temporaryCredentials?: AwsCredentialIdentity;

  async login(username: string, password: string): Promise<Object | undefined> {
    try {
      this.#user = (await Auth.signIn(username, password)) as CognitoUser;
      this.#jwtToken = this.#user
        ?.getSignInUserSession()
        ?.getIdToken()
        .getJwtToken();

      return this.#user;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  getUsername() {
    return this.#user?.getUsername();
  }

  // * Lazy load temoprary credentials
  async getTemporaryCredentials() {
    if (this.#temporaryCredentials) {
      return this.#temporaryCredentials;
    }
    this.#temporaryCredentials = await this.#generateTemporaryCredentials();
    return this.#temporaryCredentials;
  }

  /**
   *
   * @returns Temporary credentials based on the #user's authorization and identity pool
   */
  async #generateTemporaryCredentials() {
    try {
      const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolId}`;
      let cognitoIdentity = null;

      if (this.#jwtToken) {
        cognitoIdentity = new CognitoIdentityClient({
          credentials: fromCognitoIdentityPool({
            // ! Necessary as there is a bug where region is not being discovered automatically by the CognitoIdentityClient
            clientConfig: {
              region: awsRegion,
            },
            identityPoolId: AuthStack.SpaceIdentityPoolId,
            logins: {
              [cognitoIdentityPool]: this.#jwtToken,
            },
          }),
        });
      }

      if (!cognitoIdentity) {
        return;
      }

      const credentials = await cognitoIdentity.config.credentials();
      return credentials;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  getCurrentToken() {
    return this.#jwtToken;
  }
}
