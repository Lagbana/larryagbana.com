import { Space } from "../entities";
import { MissingFieldError } from "./errors";

export function validateAsSpace(arg: any) {
  const space = arg as Space;

  if (!space.id) {
    throw new MissingFieldError("id");
  }

  if (!space.location) {
    throw new MissingFieldError("location");
  }

  if (!space.name) {
    throw new MissingFieldError("name");
  }

  return true;
}
