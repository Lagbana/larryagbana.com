import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export function getEnvVar(varName: string) {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Environment variable ${value} is not set`);
  }
  return value;
}
