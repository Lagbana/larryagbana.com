function base62Encode(timestamp: number) {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let output = "";

  while (timestamp > 0) {
    const remainder = timestamp % 62;
    output = characters.charAt(remainder) + output;
    timestamp = Math.floor(timestamp / 62);
  }

  return output;
}

export function createdShortenedUrl(shortenedDomain: string) {
  const timestamp = Date.now();
  const hash = base62Encode(timestamp);
  const shortUrl = shortenedDomain + hash;

  return { hash, shortUrl };
}

export function generateId(url: string) {
  return Buffer.from(url).toString("base64url");
}

export function isValidURL(url: any) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
