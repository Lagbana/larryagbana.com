import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

test("renders shortener form", () => {
  render(<App />);
  const input = screen.getByPlaceholderText("Enter URL to shorten");
  const submitButton = screen.getByText("Shorten");
  expect(input).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});
