import { InvalidJsonError } from "./errors";

export function parseJSON(obj: string) {
  try {
    return JSON.parse(obj);
  } catch (error) {
    throw new InvalidJsonError(error.message);
  }
}
