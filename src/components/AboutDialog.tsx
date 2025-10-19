import { Alert, Button, CloseButton, Code, Dialog, Link, Portal, Tabs, Text, VStack } from "@chakra-ui/react";
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
                  <VStack gap={4} align="stretch">
                    <Text>
                      This dashboard provides a centralized view of your open GitHub Pull Requests, allowing you to
                      quickly see their status, review, and manage them. To fetch pull request data, this application
                      requires you to authenticate with your GitHub account.
                    </Text>
                    <Alert.Root status="warning">
                      <Alert.Indicator />
                      <Alert.Content>
                        <Alert.Title fontSize="lg">Permissions Required</Alert.Title>
                        <Alert.Description maxWidth="sm">
                          This application requires access to your repositories to read pull requests and modify their
                          state (e.g., merge). Specifically, it needs the <strong>repo</strong> and{" "}
                          <strong>workflow</strong> permissions. Please review the requested permissions carefully
                          during the authorization process.
                        </Alert.Description>
                      </Alert.Content>
                    </Alert.Root>

                    <Text>
                      Build info: <Code>{import.meta.env.VITE_GIT_COMMIT_HASH}</Code>,{" "}
                      {import.meta.env.VITE_GIT_COMMIT_DATE}
                    </Text>

                    <Text>
                      Source:{" "}
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/rm-hull/github-pr-dashboard"
                      >
                        https://github.com/rm-hull/github-pr-dashboard
                      </Link>
                    </Text>
                  </VStack>
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
