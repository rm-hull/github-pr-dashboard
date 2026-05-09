import { CodeBlock, createShikiAdapter } from "@chakra-ui/react";
import type { HighlighterGeneric } from "shiki";
import { useColorMode } from "./color-mode";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shikiAdapter = createShikiAdapter<HighlighterGeneric<any, any>>({
  async load() {
    const { createHighlighter } = await import("shiki");
    return createHighlighter({
      langs: ["tsx", "typescript", "scss", "html", "bash", "json", "diff", "java", "python", "go", "ruby", "php", "csharp", "cpp", "yaml", "markdown"],
      themes: ["github-dark", "github-light"],
    });
  },
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
});

export interface CodeBlockProps extends Omit<CodeBlock.RootProps, "children"> {
  title?: string;
}

export const CodeBlockRoot = ({ title, ...rest }: CodeBlockProps) => {
  const { colorMode } = useColorMode();

  return (
    <CodeBlock.AdapterProvider value={shikiAdapter}>
      <CodeBlock.Root
        {...rest}
        meta={{ ...rest.meta, colorScheme: colorMode }}
      >
        {title && (
          <CodeBlock.Header>
            <CodeBlock.Title>{title}</CodeBlock.Title>
          </CodeBlock.Header>
        )}
        <CodeBlock.Content>
          <CodeBlock.Code>
            <CodeBlock.CodeText />
          </CodeBlock.Code>
        </CodeBlock.Content>
      </CodeBlock.Root>
    </CodeBlock.AdapterProvider>
  );
};
