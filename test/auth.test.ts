import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

async function testAuth() {
  const authService = new AuthService();
  const loginResult = await authService.login("tester1", "Teeth@2023");
  console.log(loginResult.getSignInUserSession().getIdToken().getJwtToken());
  console.log(`
  ============
  `);
  const credentialsResponse = await authService.generateTemporaryCredentials(
    loginResult
  );

  const credentials = {
    accessKeyId: credentialsResponse.Credentials?.AccessKeyId,
    expiration: credentialsResponse.Credentials?.Expiration,
    secretAccessKey: credentialsResponse.Credentials?.SecretKey,
    sessionToken: credentialsResponse.Credentials?.SessionToken,
  };

  // console.log(credentials);
  const buckets = await listBuckets(credentials);
  console.log(`🪣 `, buckets);
}

async function listBuckets(credentials: any) {
  const client = new S3Client({ credentials });
  const command = new ListBucketsCommand({});
  return await client.send(command);
}

testAuth();
