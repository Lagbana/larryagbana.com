import { z } from "zod";

const UrlSchema = z.string().url();

export function validateUrl(url: string): string | null {
  try {
    return UrlSchema.parse(url);
  } catch {
    return null;
  }
}
