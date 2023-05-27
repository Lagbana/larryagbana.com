import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";
import { DataStack, ApiStack } from "../../../outputs.json";
import { type SpaceEntry } from "../types";

// TODO: Fix the exported endpoint to not be dynamic
const spacesUrl = ApiStack.SpaceFinderApiEndpoint2EFB5B06 + "spaces";

export class DataService {
  #authService: AuthService;
  #s3Client?: S3Client;
  #awsRegion = "us-east-1";

  constructor(authservice: AuthService) {
    this.#authService = authservice;
  }

  public async getSpaces() {
    const spacesResult = await fetch(spacesUrl, {
      method: "GET",
      headers: {
        Authorization: this.#authService.getCurrentToken()!,
      },
    });
    const responseJSON: Array<SpaceEntry> = await spacesResult.json();
    return responseJSON;
  }

  public async reserveSpace(spaceId: string) {
    return "yaba daba don't";
  }

  public async createSpace(name: string, location: string, photo?: File) {
    const space = {} as SpaceEntry;
    space.name = name;
    space.location = location;

    try {
      const controller = new AbortController();
      const signal = controller.signal;
      setTimeout(() => controller.abort("Took longer than expected!"), 3000);

      if (photo) {
        const uploadUrl = await this.#uploadPublicFile(photo);
        space.photoUrl = uploadUrl;
      }

      const postResult = await fetch(spacesUrl, {
        method: "POST",
        body: JSON.stringify(space),
        signal,
        headers: {
          Authorization: this.#authService.getCurrentToken()!,
        },
      });
      const responseJSON = await postResult.json();
      return responseJSON.id;
    } catch (err) {
      const error = err as Error;
      if (error.name === "AbortError") {
        console.error("Fetch aborted. Upload took too long!");
      }
    }
  }

  async #uploadPublicFile(file: File) {
    const credentials = await this.#authService.getTemporaryCredentials();

    // Use temporary credentials to access s3
    if (!this.#s3Client) {
      this.#s3Client = new S3Client({
        credentials: credentials as any,
        region: this.#awsRegion,
      });
    }

    const command = new PutObjectCommand({
      Bucket: DataStack.SpacePhotosBucketName,
      Key: file.name,
      ACL: ObjectCannedACL.public_read,
      Body: file,
    });

    await this.#s3Client.send(command);
    return `https://${command.input.Bucket}.s3.${
      this.#awsRegion
    }.amazonaws.com/${command.input.Key}`;
  }

  public isAuthorized() {
    return this.#authService.isAuthorized();
  }
}
