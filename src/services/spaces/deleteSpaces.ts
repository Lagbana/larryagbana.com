import { APIGatewayProxyResult } from "aws-lambda";
import { SpacesRepository } from "../../repository/spaces/spaces.interface";

export async function deleteSpaces(
  spaceId: string,
  spaceRepository: SpacesRepository
): Promise<APIGatewayProxyResult> {
  if (spaceId) {
    await spaceRepository.delete(spaceId);

    return {
      statusCode: 200,
      body: JSON.stringify(`deleted space with id: ${spaceId}`),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify(`Please provide the right args`),
  };
}
