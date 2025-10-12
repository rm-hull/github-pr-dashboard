import { IconButton, Popover, Portal, Separator } from "@chakra-ui/react";
import { FcInfo } from "react-icons/fc";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface InfoPopoverProps {
  title?: string;
  descr?: string;
}
export function InfoPopover({ title, descr }: InfoPopoverProps) {
  if (!descr) {
    return null;
  }

  return (
    <Popover.Root lazyMount unmountOnExit>
      <Popover.Trigger asChild>
        <IconButton variant="plain" size="sm">
          <FcInfo />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="lg">
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
