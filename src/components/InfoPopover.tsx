import { Box, Popover, Portal, Separator } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Mermaid } from "./Mermaid";
import "./info-popover.css";

interface InfoPopoverProps {
  title?: string;
  descr?: string;
  width?: string;
}

export function InfoPopover({ title, descr, width, children }: PropsWithChildren<InfoPopoverProps>) {
  if (!descr) {
    return children;
  }

  return (
    <Popover.Root lazyMount unmountOnExit>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width={width}>
            <Popover.Arrow />
            <Popover.Body maxHeight="70%" overflowY="scroll" my={4} py={0}>
              {title && (
                <>
                  <Popover.Title fontSize="lg" fontWeight="bold" py={2}>
                    {title}
                  </Popover.Title>
                  <Separator py={1} />
                </>
              )}
              <Box className="pr-body-markdown-container">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code({ children, className, ...rest }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const content = typeof children === "string" ? children : "";
                      return match && match[1] === "mermaid" ? (
                        <Mermaid chart={content.trimEnd()} />
                      ) : (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {descr}
                </Markdown>
              </Box>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
