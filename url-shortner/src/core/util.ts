export function createdShortenedUrl(
  base64url: string,
  shortenedDomain: string
) {
  const chopped = base64url.slice(0, 6);
  return shortenedDomain + chopped;
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
