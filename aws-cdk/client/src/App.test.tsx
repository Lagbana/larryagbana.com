import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

test("renders shortener form", () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Example: http:/);
  const submitButton = screen.getByText("Get your link");
  expect(input).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});
