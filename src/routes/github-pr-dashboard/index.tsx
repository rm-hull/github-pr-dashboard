import { Container, Progress } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import PullRequestsList from "@/components/PullRequestsList";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useOpenPullRequests } from "@/hooks/useOpenPullRequests";

export const Route = createFileRoute("/github-pr-dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useOpenPullRequests();
  useErrorToast("open-prs", "Failed to load open PRs", error);

  return (
    <>
      {isLoading && (
        <Progress.Root maxW="full" value={null} colorPalette="blue" size="sm">
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      )}
      {data && (
        <Container py={4} maxW="container.md" bg="bg.panel">
          <PullRequestsList pulls={data} />
        </Container>
      )}
    </>
  );
}
