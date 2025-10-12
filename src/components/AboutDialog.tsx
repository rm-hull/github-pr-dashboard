import { Button, CloseButton, Dialog, Portal, Tabs, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { License } from "./License";

export function AboutDialog({ children }: PropsWithChildren) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Tabs.Root colorPalette="blue" defaultValue="about">
              <Dialog.Header>
                <Dialog.Title width="100%" display="flex">
                  <Tabs.List width="100%">
                    <Tabs.Trigger value="about">About</Tabs.Trigger>
                    <Tabs.Trigger value="license">MIT License</Tabs.Trigger>
                  </Tabs.List>
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Tabs.Content value="settings"></Tabs.Content>
                <Tabs.Content value="about">
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </Text>
                </Tabs.Content>
                <Tabs.Content value="license">
                  <License showHeading={false} />
                </Tabs.Content>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="subtle">Close</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Tabs.Root>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
