import { Alert, Code, Link, Text, VStack } from "@chakra-ui/react";

export function About() {
  return (
    <VStack gap={4} align="stretch">
      <Text>
        This dashboard provides a centralized view of your open GitHub Pull Requests, allowing you to quickly see their
        status, review, and manage them. To fetch pull request data, this application requires you to authenticate with
        your GitHub account.
      </Text>
      <Alert.Root status="warning">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title fontSize="lg">Permissions Required</Alert.Title>
          <Alert.Description maxWidth="sm">
            This application requires access to your repositories to read pull requests and modify their state (e.g.,
            merge). Specifically, it needs the <strong>repo</strong> and <strong>workflow</strong> permissions. Please
            review the requested permissions carefully during the authorization process.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Text>
        Build info: <Code>{import.meta.env.VITE_GIT_COMMIT_HASH}</Code>, {import.meta.env.VITE_GIT_COMMIT_DATE}
      </Text>

      <Text>
        Source:{" "}
        <Link target="_blank" rel="noopener noreferrer" href="https://github.com/rm-hull/github-pr-dashboard">
          https://github.com/rm-hull/github-pr-dashboard
        </Link>
      </Text>
    </VStack>
  );
}
