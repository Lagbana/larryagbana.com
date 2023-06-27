import React, { useState, useCallback, useMemo, useRef } from "react";
import styled from "styled-components";
import { Toast } from "./Toast";
import { FaCopy } from "react-icons/fa";
import { validateUrl, useClipboard } from "../utils";
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

const ShortenedUrl = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  padding: 8px;
  background-color: #cccc;
  color: #333333;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;

  &:active {
    transform: scale(0.95); /* scale down to 95% when clicked */
  }

  &:hover {
    color: #0a52ed;
  }
`;

const ShortenedUrlContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 32px;
  margin-top: 16px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding: 48px;
  width: 80%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const CTAHeader = styled.h1``;

const CTASubHeader = styled.h3`
  margin: 0;
`;

const ErrorComponent = styled.pre`
  color: red;
  font-weight: bold;
`;

export const ShortenForm = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { onCopy } = useClipboard(shortenedUrl);

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

        if (response.status === 429) {
          setError(`Too Many Requests, please try again later!`);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUrl("");
        setShortenedUrl(data.shortenedUrl);
      } catch (error) {
        console.error(`Failed to create shortened url: `, error);
        setError(`Failed to create short url. Please try again later.`);
      }
    },
    [url]
  );

  const throttledSubmit = useMemo(
    () => throttle(handleSubmit, 1000),
    [handleSubmit]
  );

  const handleCopy = useCallback(() => {
    onCopy();
    setToastVisible(true);
  }, [shortenedUrl]);

  return (
    <Wrapper>
      <Form onSubmit={throttledSubmit}>
        <CTAHeader>Shorten a long link</CTAHeader>
        <CTASubHeader>Paste a long URL</CTASubHeader>
        <Input
          type='text'
          ref={inputRef}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onMouseEnter={() => {
            inputRef.current?.focus();
          }}
          placeholder='Example: http://some-long-link.com/shorten-it'
        />
        <Button type='submit'>Get your link</Button>
      </Form>
      <ShortenedUrlContainer>
        {shortenedUrl && (
          <ShortenedUrl onClick={handleCopy}>
            <FaCopy /> <span>{shortenedUrl}</span>
          </ShortenedUrl>
        )}
        {toastVisible && <Toast message={"Copied!"} />}
        {error && <ErrorComponent>{error}</ErrorComponent>}
      </ShortenedUrlContainer>
    </Wrapper>
  );
};
