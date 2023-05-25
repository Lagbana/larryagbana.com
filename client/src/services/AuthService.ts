import { type CognitoUser } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";
import { AuthStack } from "../../../outputs.json";

const awsRegion = "us-east-1";

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: awsRegion,
    userPoolId: AuthStack.SpaceUserPoolId,
    userPoolWebClientId: AuthStack.SpaceUserPoolClientId,
    identityPoolId: AuthStack.SpaceIdentityPoolId,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  #user: CognitoUser | undefined;

  async login(username: string, password: string): Promise<Object | undefined> {
    try {
      this.#user = (await Auth.signIn(username, password)) as CognitoUser;
      return this.#user;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  getUsername() {
    return this.#user?.getUsername();
  }
}
