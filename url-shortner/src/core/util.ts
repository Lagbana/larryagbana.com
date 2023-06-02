export function createdShortenedUrl(
  base64url: string,
  shortenedDomain: string
) {
  const id = base64url.slice(0, 7);
  return {
    id,
    shortUrl: shortenedDomain + id,
  };
}

export function createBase64Url(url: string) {
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
