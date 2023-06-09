import { validateUrl } from ".";

describe("Utils", () => {
  it("validates input as url", () => {
    const entry = "https://www.google.com/";
    expect(validateUrl(entry)).toBe("https://www.google.com/");
  });

  it("invalidates non-url", () => {
    const entry = "google";
    expect(validateUrl(entry)).toBe(null);
  });
});
