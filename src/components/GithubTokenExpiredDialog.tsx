import { Alert, Button, Dialog, Heading } from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";

export function GithubTokeExpiredDialog() {
  const { login, isExpired } = useAuth();

  return (
    <Dialog.Root open={isExpired} closeOnInteractOutside={false} closeOnEscape={false}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Alert.Root status="warning">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>
                  <Heading size="md">GitHub token expired</Heading>
                </Alert.Title>
                <Alert.Description>
                  Your GitHub access token has expired or is no longer valid. To securely continue interacting with
                  GitHub and access your pull requests, please re-authenticate.
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          </Dialog.Header>
          <Dialog.Footer>
            <Button colorPalette="blue" variant="subtle" onClick={login}>
              Re-login with GitHub
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
