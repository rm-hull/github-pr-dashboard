import { Code } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export function InlineCodeText({ children }: PropsWithChildren) {
  // Convert text to string (in case it’s not)
  const text = String(children);

  // Split by backtick pairs using regex
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          const codeText = part.slice(1, -1); // remove the backticks
          return (
            <Code key={i}>
              {codeText}
            </Code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
