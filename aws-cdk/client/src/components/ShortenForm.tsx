import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { validateUrl } from "../utils";
import throttle from "lodash.throttle";
import { ENDPOINT_URL } from "../config";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 80px;
  width: 80%;
  max-width: 500px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 1rem;
  background-color: #343a40;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #495057;
  }
`;

const ShortenedUrl = styled.p`
  margin-top: 20px;
  color: #495057;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  height: 30vh;
  width: 80%;
  background-color: white;
  border-radius: 8px;
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
        <Input
          type='text'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder='Enter URL to shorten'
        />
        <Button type='submit'>Shorten</Button>
      </Form>
      {shortenedUrl && (
        <ShortenedUrl>Shortened URL: {shortenedUrl}</ShortenedUrl>
      )}
      {error && <p>{error}</p>}
    </Wrapper>
  );
};
