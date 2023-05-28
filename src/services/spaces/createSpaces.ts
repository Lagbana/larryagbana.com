import { APIGatewayProxyResult } from "aws-lambda";
import { SpacesRepository } from "../../repository/spaces/spaces.interface";
import { Space } from "../../entities";
import { createRandomId, validateAsSpace } from "../../utils";

export async function createSpaces(
  data: Space,
  spaceRepository: SpacesRepository
): Promise<APIGatewayProxyResult> {
  const newSpace = data;

  const randomId = createRandomId();
  newSpace.id = randomId;
  validateAsSpace(newSpace);

  const createdSpaceId = await spaceRepository.create(newSpace);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: createdSpaceId }),
  };
}
