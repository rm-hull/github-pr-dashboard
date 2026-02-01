import { Box, Popover, Portal, Separator } from "@chakra-ui/react";
import { PropsWithChildren, ReactNode } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import { Mermaid } from "./Mermaid";
import "./info-popover.css";

interface InfoPopoverProps {
  title?: string;
  descr?: string;
  width?: string;
  owner?: string;
  repo?: string;
}

const getChildrenText = (children: ReactNode): string => {
  if (Array.isArray(children)) {
    return children.join("");
  }
  if (typeof children === "string") {
    return children;
  }
  return "";
};

export function InfoPopover({ title, descr, width, owner, repo, children }: PropsWithChildren<InfoPopoverProps>) {
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
                  remarkPlugins={[
                    remarkGfm,
                    [remarkGithub, { repository: owner && repo ? `${owner}/${repo}` : undefined }],
                  ]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a(props) {
                      return <a {...props} target="_blank" rel="noopener noreferrer" />;
                    },
                    code({ children, className, ...rest }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const content = getChildrenText(children);

                      if (match && match[1] === "mermaid") {
                        return <Mermaid chart={content.trimEnd()} />;
                      }

                      return (
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
