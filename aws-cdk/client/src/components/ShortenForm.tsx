import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { validateUrl } from "../utils";
import throttle from "lodash.throttle";
import { ENDPOINT_URL } from "../config";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 80%;
  max-width: 500px;
`;

const Input = styled.input`
  padding: 16px;
  font-size: 20px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  margin-top: 0;
`;

const Button = styled.button`
  padding: 18px 30px;
  font-size: 20px;
  background-color: #2a5bd7;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #3c6fe0;
  }
`;

const ShortenedUrl = styled.p`
  margin-top: 20px;
  color: #495057;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  height: 40vh;
  width: 80%;
  background-color: white;
  border-radius: 8px;
`;

const CTAHeader = styled.h1``;

const CTASubHeader = styled.h3`
  margin: 0;
`;

export const ShortenForm = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const validUrl = validateUrl(url);
      if (!validUrl) {
        setError("Invalid URL. Please try again.");
        return;
      }

      try {
        const response = await fetch(ENDPOINT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setShortenedUrl(data.shortenedUrl);
      } catch (error) {
        console.error(`Fetch operation error: `, error);
      }
    },
    [url]
  );

  const throttledSubmit = useMemo(
    () => throttle(handleSubmit, 1000),
    [handleSubmit]
  );

  return (
    <Wrapper>
      <Form onSubmit={throttledSubmit}>
        <CTAHeader>Shorten a long link</CTAHeader>
        <CTASubHeader>Paste a long URL</CTASubHeader>
        <Input
          type='text'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder='Example: http://some-long-link.com/shorten-it'
        />
        <Button type='submit'>Get your link</Button>
      </Form>
      {shortenedUrl && (
        <ShortenedUrl>Shortened URL: {shortenedUrl}</ShortenedUrl>
      )}
      {error && <p>{error}</p>}
    </Wrapper>
  );
};
