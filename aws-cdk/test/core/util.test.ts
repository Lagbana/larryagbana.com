import { createdShortenedUrl, isValidURL } from "../../src/core/util";

describe("Utils tests", () => {
  describe("base62Encode", () => {
    const base62Characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    it("should generate base62 encoded id", () => {
      const { urlPath } = createdShortenedUrl(
        "http://test.com/",
        "some-request-id-12345"
      );
      expect(urlPath.length).toBeGreaterThan(0);
      [...urlPath].forEach((char) => {
        expect(base62Characters.includes(char)).toBe(true);
      });
    });
  });

  describe("createdShortenedUrl", () => {
    it("should generate a shortened url", () => {
      const shortenedDomain = "http://test.com/";
      const result = createdShortenedUrl(
        shortenedDomain,
        "some-request-id-12345"
      );

      expect(result.urlPath.length).toBeGreaterThan(0);
      expect(result.shortUrl).toEqual(expect.stringContaining(shortenedDomain));
    });
  });

  describe("isValidURL", () => {
    it("should return true for valid URLs", () => {
      expect(isValidURL("https://www.google.com")).toBe(true);
      expect(isValidURL("http://localhost:3000")).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(isValidURL("google")).toBe(false);
      expect(isValidURL(12345)).toBe(false);
      expect(isValidURL("")).toBe(false);
    });
  });
});
