export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Value for ${missingField} expected!`);
  }
}

export class InvalidJsonError extends Error {}
