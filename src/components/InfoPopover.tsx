import { Popover, Portal, Separator } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

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
            <Popover.Body maxHeight="70%" overflowY="scroll">
              {title && (
                <>
                  <Popover.Title fontSize="lg" fontWeight="bold" py={2}>
                    {title}
                  </Popover.Title>
                  <Separator py={1} />
                </>
              )}
              <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {descr}
              </Markdown>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
