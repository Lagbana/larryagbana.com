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

export function createdShortenedUrl(
  shortenedDomain: string,
  requestId: string
) {
  const timestamp = Date.now();
  const partialRequestId = parseInt(requestId.substring(0, 8), 36);
  const urlPath = base62Encode(timestamp + partialRequestId);
  const shortUrl = shortenedDomain + urlPath;

  return { urlPath, shortUrl };
}

export function isValidURL(url: any) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
