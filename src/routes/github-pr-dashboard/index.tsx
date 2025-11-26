import { Container, Progress } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import PullRequestsList from "@/components/PullRequestsList";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useOpenPullRequests } from "@/hooks/useOpenPullRequests";

export const Route = createFileRoute("/github-pr-dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isFetching, error } = useOpenPullRequests();
  useErrorToast("open-prs", "Failed to load open PRs", error);

  return (
    <>
      <Progress.Root maxW="full" value={null} colorPalette="blue" size="xs" height={2} backgroundColor="bg.panel">
        {isFetching && (
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        )}
      </Progress.Root>
      {data && (
        <Container py={2} maxW="full" bg="bg.panel" minHeight="calc(100vh - 4rem)">
          <PullRequestsList pulls={data} />
        </Container>
      )}
    </>
  );
}
