import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { createSpaces } from "../../services/spaces/createSpaces";
import { getSpace } from "../../services/spaces/getSpace";
import { getSpaces } from "../../services/spaces/getSpaces";
import { updateSpaces } from "../../services/spaces/updateSpaces";
import { deleteSpaces } from "../../services/spaces/deleteSpaces";
import { DynamoDBSpacesRepository } from "../../repository/spaces";
import {
  InvalidJsonError,
  MissingFieldError,
  addCorsHeader,
  parseJSON,
} from "../../utils";
import { Space } from "../../entities";
import { hasAdminGroup } from "../../infra/stacks/utils";

const spaceRepository = new DynamoDBSpacesRepository();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let result: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case "GET":
        if (event.queryStringParameters) {
          const spaceId = event.queryStringParameters.id;
          result = await getSpace(spaceId, spaceRepository);
          break;
        }
        result = await getSpaces(spaceRepository);
        break;
      case "POST":
        const space = parseJSON(event.body) as Space;
        result = await createSpaces(space, spaceRepository);
        break;
      case "PUT":
        const updateSpaceId = event.queryStringParameters.id;
        const spaceData = parseJSON(event.body) as Partial<Space>;
        result = await updateSpaces(updateSpaceId, spaceData, spaceRepository);
        break;
      case "DELETE":
        if (!hasAdminGroup(event)) {
          return {
            statusCode: 403,
            body: JSON.stringify(`Forbidden!`),
          };
        }
        const deleteSpaceId = event.queryStringParameters.id;
        result = await deleteSpaces(deleteSpaceId, spaceRepository);
        break;
      default:
        break;
    }
  } catch (err) {
    if (err instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(err.message),
      };
    }

    if (err instanceof InvalidJsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify(err.message),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify(err.message),
    };
  }

  addCorsHeader(result);
  return result;
}

export { handler };
