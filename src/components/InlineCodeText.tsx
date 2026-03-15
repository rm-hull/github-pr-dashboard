import { Code } from "@chakra-ui/react";
import { Children, isValidElement, ReactNode, ReactElement, cloneElement, PropsWithChildren } from "react";
import { SearchHighlight } from "./SearchHighlight";

export function InlineCodeText({ children }: PropsWithChildren) {
  const processNode = (node: ReactNode): ReactNode => {
    // Handle strings - split by backticks
    if (typeof node === "string") {
      const parts = node.split(/(`[^`]+`)/g);
      return (
        <>
          {parts.map((part, i) => {
            if (part.startsWith("`") && part.endsWith("`")) {
              const codeText = part.slice(1, -1);
              return <Code key={i}>{codeText}</Code>;
            }
            return part;
          })}
        </>
      );
    }

    // Special handling for Highlight component
    if (isValidElement(node) && node.type === SearchHighlight) {
      const props = node.props as any;
      const { children: highlightChildren, ...highlightProps } = props;

      // Extract the string from Highlight's children
      const text = String(highlightChildren);

      // Split by backticks
      const parts = text.split(/(`[^`]+`)/g);

      return (
        <>
          {parts.map((part, i) => {
            if (part.startsWith("`") && part.endsWith("`")) {
              const codeText = part.slice(1, -1);
              return (
                <Code key={i}>
                  <SearchHighlight key={i} {...highlightProps}>
                    {codeText}
                  </SearchHighlight>
                </Code>
              );
            }
            return (
              <SearchHighlight key={i} {...highlightProps}>
                {part}
              </SearchHighlight>
            );
          })}
        </>
      );
    }

    // Handle React elements - recursively process their children
    if (isValidElement(node)) {
      const props = node.props as any;
      return cloneElement(
        node as ReactElement<any>,
        props,
        ...Children.toArray(props.children).map(processNode)
      );
    }

    if (Array.isArray(node)) {
      return <>{node.map(processNode)}</>;
    }

    return node;
  };

  return <>{processNode(children)}</>;
}
