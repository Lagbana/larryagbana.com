import { useState, useCallback, useEffect } from "react";
import { z } from "zod";
import copy from "copy-to-clipboard";

const UrlSchema = z.string().url();

export function validateUrl(url: string): string | null {
  try {
    return UrlSchema.parse(url);
  } catch {
    return null;
  }
}

/**
 * React hook to copy content to clipboard
 *
 * @param text the text or value to copy
 * @param timeout delay (in ms) to switch back to initial state once copied.
 */
export function useClipboard(text: string, timeout = 1500) {
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = useCallback(() => {
    const didCopy = copy(text);
    setHasCopied(didCopy);
  }, [text]);

  useEffect(() => {
    if (hasCopied) {
      const id = setTimeout(() => {
        setHasCopied(false);
      }, timeout);

      return () => clearTimeout(id);
    }
  }, [timeout, hasCopied]);

  return { value: text, onCopy, hasCopied };
}
