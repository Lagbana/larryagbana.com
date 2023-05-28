import { APIGatewayProxyResult } from "aws-lambda";
import { SpacesRepository } from "../../repository/spaces/spaces.interface";

export async function getSpaces(
  repository: SpacesRepository
): Promise<APIGatewayProxyResult> {
  const spaces = await repository.getAll();

  return {
    statusCode: 200,
    body: JSON.stringify(spaces),
  };
}
