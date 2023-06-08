import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export const SHORTNER_BASE_URL = process.env.SHORTNER_BASE_URL;
export const VERSION = process.env.COMMIT_HASH;
