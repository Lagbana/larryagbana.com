import { APIGatewayProxyResult } from "aws-lambda";
import { SpacesRepository } from "../../repository/spaces/spaces.interface";

export async function getSpace(
  spaceId: string,
  repository: SpacesRepository
): Promise<APIGatewayProxyResult> {
  if (spaceId) {
    const spaceItem = await repository.get(spaceId);

    if (spaceItem) {
      return {
        statusCode: 200,
        body: JSON.stringify(spaceItem),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Space with id: ${spaceId} not Found`,
        }),
      };
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Bad Request: id is required",
      }),
    };
  }
}
