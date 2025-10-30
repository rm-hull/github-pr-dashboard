import { Button, CloseButton, Dialog, Portal, Tabs } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { License } from "./License";
import { About } from "./settings/About";

export function SettingsDialog({ children }: PropsWithChildren) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Tabs.Root colorPalette="blue" defaultValue="settings">
              <Dialog.Header pb={0}>
                <Dialog.Title width="100%" display="flex">
                  <Tabs.List width="100%">
                    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                    <Tabs.Trigger value="about">About</Tabs.Trigger>
                    <Tabs.Trigger value="license">MIT License</Tabs.Trigger>
                  </Tabs.List>
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Tabs.Content value="settings">Coming soon!</Tabs.Content>
                <Tabs.Content value="about">
                  <About />
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
