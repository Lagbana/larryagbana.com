import { APIGatewayProxyResult } from "aws-lambda";
import { SpacesRepository } from "../../repository/spaces/spaces.interface";
import { Space } from "../../entities";

export async function updateSpaces(
  spaceId: string,
  spaceData: Partial<Space>,
  spaceRepository: SpacesRepository
): Promise<APIGatewayProxyResult> {
  if (spaceId && spaceData) {
    const updatedSpace = await spaceRepository.update(spaceId, spaceData);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedSpace),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify("Please provide data to update! 🤔"),
  };
}
