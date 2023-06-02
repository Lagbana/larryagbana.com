import { createdShortenedUrl, createBase64Url, isValidURL } from "./util";

describe("Utility functions", () => {
  it("creates shortened URL", () => {
    const base64url = createBase64Url("https://some-long-example-url.com");
    const result = createdShortenedUrl(base64url, "https://shrt.ca/");
    expect(result.id).toBe("aHR0cHM");
    expect(result.shortUrl).toBe("https://shrt.ca/aHR0cHM");
  });

  it("creates Base64 URL", () => {
    const result = createBase64Url("https://some-long-example-url.com");
    expect(result).toBe("aHR0cHM6Ly9zb21lLWxvbmctZXhhbXBsZS11cmwuY29t");
  });

  it("validates URL", () => {
    const result = isValidURL("https://example.com");
    expect(result).toBe(true);
  });

  it("invalidates wrong URL", () => {
    const result = isValidURL("not-a-url");
    expect(result).toBe(false);
  });
});
