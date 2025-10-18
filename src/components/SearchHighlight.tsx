import { Highlight } from "@chakra-ui/react";

interface SearchHighlightProps {
  query?: string;
  children: string | unknown[];
}

export function SearchHighlight({ children, query }: SearchHighlightProps) {
  return (
    <Highlight ignoreCase query={query ?? ""} styles={{ bg: "orange.subtle", color: "orange.fg" }}>
      {Array.isArray(children) ? children.map((item) => String(item)).join(" ") : children}
    </Highlight>
  );
}
