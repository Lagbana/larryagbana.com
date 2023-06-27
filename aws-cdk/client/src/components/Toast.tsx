import { useState, useEffect } from "react";
import styled from "styled-components";

const ToastContainer = styled.span`
  display: inline-flex;
  justify-content: center;
  margin-top: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #98e898;
`;

export const Toast = ({ message = "", duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  if (!visible) {
    return null;
  }

  return (
    <aside role='alert'>
      <ToastContainer>{message}</ToastContainer>
    </aside>
  );
};
