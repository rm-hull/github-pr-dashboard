import { Box, Popover, Portal, Separator } from "@chakra-ui/react";
import { PropsWithChildren, Children, isValidElement } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import remarkGithubAlerts from "remark-github-alerts";
import "remark-github-alerts/styles/github-colors-light.css";
import "remark-github-alerts/styles/github-colors-dark-class.css";
import "remark-github-alerts/styles/github-base.css";
import { Mermaid } from "./Mermaid";
import { CodeBlockRoot } from "./ui/code-block";
import "./info-popover.css";

interface InfoPopoverProps {
  title?: string;
  descr?: string;
  width?: string;
  owner?: string;
  repo?: string;
}

function getChildrenText(children: unknown): string {
  let text = "";
  Children.forEach(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      text += child;
    } else if (isValidElement<{ children?: unknown }>(child) && child.props.children) {
      text += getChildrenText(child.props.children);
    }
  });
  return text;
}

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
                    remarkGithubAlerts,
                  ]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a(props) {
                      return <a {...props} target="_blank" rel="noopener noreferrer" />;
                    },
                    pre(props) {
                      return <>{props.children}</>;
                    },
                    code({ children, className, ...rest }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const content = getChildrenText(children);

                      if (match && match[1] === "mermaid") {
                        return <Mermaid chart={content.trimEnd()} />;
                      }

                      if (match) {
                        return <CodeBlockRoot code={content.trimEnd()} language={match[1]} size="sm" border="none" />;
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
