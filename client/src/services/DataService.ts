import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";
import { DataStack, ApiStack } from "../../../outputs.json";

interface Space {
  name: string;
  location: string;
  photoUrl?: string;
}

// TODO: Fix the exported endpoint to not be dynamic
const spacesUrl = ApiStack.SpaceFinderApiEndpoint2EFB5B06 + "spaces";

export class DataService {
  #authService: AuthService;
  #s3Client?: S3Client;
  #awsRegion = "us-east-1";

  constructor(authservice: AuthService) {
    this.#authService = authservice;
  }
  async createSpace(name: string, location: string, photo?: File) {
    const space = {} as Space;
    space.name = name;
    space.location = location;

    try {
      // const controller = new AbortController();
      // const signal = controller.signal;
      // setTimeout(() => controller.abort("Took longer than expected!"), 5000);

      if (photo) {
        const uploadUrl = await this.#uploadPublicFile(photo);
        space.photoUrl = uploadUrl;
      }

      const postResult = await fetch(spacesUrl, {
        method: "POST",
        body: JSON.stringify(space),
        // signal,
        headers: {
          Authorization: this.#authService.getCurrentToken()!,
        },
      });
      const responseJSON = await postResult.json();
      return responseJSON.id;
    } catch (err) {
      const error = err as Error;
      if (error.name === "AbortError") {
        console.log("❌ Fetch aborted");
      }
    }
  }

  async #uploadPublicFile(file: File) {
    const credentials = await this.#authService.getTemporaryCredentials();

    // Use temporary
    if (!this.#s3Client) {
      this.#s3Client = new S3Client({
        credentials: credentials as any,
        region: this.#awsRegion,
      });
    }

    // const name = "toronto-on-ca-E6043852-3";

    const command = new PutObjectCommand({
      Bucket: DataStack.SpacePhotosBucketName,
      // Key: name,
      Key: file.name,
      ACL: ObjectCannedACL.public_read,
      Body: file,
    });

    await this.#s3Client.send(command);
    return `https://${command.input.Bucket}.s3.${
      this.#awsRegion
    }.amazonaws.com/${command.input.Key}`;
  }

  isAuthorized() {
    return true;
  }
}
