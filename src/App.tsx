// import { useEffect, useState } from "react";
import { Box, Button, Container, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PullRequestsList from "./components/PullRequestsList";
import { commentOnIssue, searchOpenPRsForUser, fetchCurrentUser } from "./api/github";
import { useGitHubAuth } from "./hooks/useGitHubAuth";

export default function App() {
  const qc = useQueryClient();
  const { token, login, logout } = useGitHubAuth();

  // React Query: fetch PRs
  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      return await fetchCurrentUser(token);
    },
    enabled: !!token,
  });

  // React Query: fetch PRs
  const prsQuery = useQuery({
    queryKey: ["my-open-prs"],
    queryFn: async () => {
      const items = await searchOpenPRsForUser(userQuery.data.login, token);
      // map repository_full_name for convenience
      return items.map((it: any) => ({
        ...it,
        repository_full_name: it.repository_url.split("/repos/")[1],
      }));
    },
    enabled: !!token && !!userQuery.data,
  });

  // const mergeMutation = useMutation({
  //   mutationFn: ({ repo, number }: { repo: string; number: number }) => mergePR(repo, number, token),
  //   onSuccess: () => qc.invalidateQueries({ queryKey: ["my-open-prs"] }),
  // });

  const commentMutation = useMutation({
    mutationFn: ({ repo, number, body }: { repo: string; number: number; body: string }) =>
      commentOnIssue(repo, number, body, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-open-prs"] }),
  });

  return (
    <Container py={8} maxW="container.md">
      <VStack gap={6} align="stretch">
        <Heading>GitHub PR Dashboard</Heading>

        {!token && (
          <Box>
            <Text mb={2}>Sign in with GitHub.</Text>
            <Button onClick={login} mb={2}>
              Login
            </Button>
          </Box>
        )}

        {!!token && (
          <Box>
            <Button
              onClick={() => {
                logout();
                window.location.reload();
              }}
              mb={4}
            >
              Sign out
            </Button>

            <Text mb={4}>Viewing PRs for: {userQuery.data?.login}</Text>

            {prsQuery.isLoading && <Spinner />}
            {prsQuery.isError && <Text color="red.500">Failed to load PRs: {(prsQuery.error as any)?.message}</Text>}
            {prsQuery.data && (
              <PullRequestsList
                prs={prsQuery.data}
                // onMerge={async (repo, number) => mergeMutation.mutateAsync({ repo, number })}
                onComment={async (repo, number, body) => commentMutation.mutateAsync({ repo, number, body })}
              />
            )}
          </Box>
        )}
      </VStack>
    </Container>
  );
}
