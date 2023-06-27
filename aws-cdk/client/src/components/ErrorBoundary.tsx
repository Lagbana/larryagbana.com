import React from "react";
import styled from "styled-components";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8d7da;
  color: #721c24;
  padding: 20px;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  font-size: 2.5em;
  font-weight: bold;
`;

const ErrorText = styled.p`
  font-size: 1.5em;
`;

interface State {
  hasError: boolean;
}
class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  State
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Oops! Something went wrong.</ErrorTitle>
          <ErrorText>
            We couldn't shorten your URL... perhaps it was short enough already?
            😄 Try refreshing the page or come back later.
          </ErrorText>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
