import { useState, useEffect } from "react";

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

  return <div className='toast'>{message}</div>;
};
