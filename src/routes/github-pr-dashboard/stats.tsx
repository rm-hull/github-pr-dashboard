import { Container, SimpleGrid } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { MergedPrsOverTimeChart } from "@/components/metrics/MergedPrsOverTimeChart";
import { MergeTimeDistributionChart } from "@/components/metrics/MergeTimeDistributionChart";
import { PrAgeDistributionChart } from "@/components/metrics/PrAgeDistributionChart";
import { PrsByRepoChart } from "@/components/metrics/PrsByRepoChart";
import { useErrorToast } from "@/hooks/useErrorToast";
import { DraftVsReadyChart } from "../../components/metrics/DraftVsReadyChart";
import { useAllPullRequests } from "../../hooks/useAllPullRequests";

export const Route = createFileRoute("/github-pr-dashboard/stats")({
  component: RouteComponent,
});

function RouteComponent() {
  const { allPullRequests: openPRs, error: errorOpen } = useAllPullRequests("open");
  const { allPullRequests: mergedPRs, error: errorMerged } = useAllPullRequests("merged");

  useErrorToast("stats", "Failed to fetch pull request details", errorOpen || errorMerged);

  return (
    <Container maxW="container.xl" py={8}>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <PrsByRepoChart pullRequests={openPRs || []} title="Open PRs by Repository" />
        <DraftVsReadyChart pullRequests={openPRs || []} />
        <PrAgeDistributionChart pullRequests={openPRs || []} />
        <PrsByRepoChart pullRequests={mergedPRs || []} title="Merged PRs by Repository" />
        <MergeTimeDistributionChart pullRequests={mergedPRs || []} />
        <MergedPrsOverTimeChart by="week" pullRequests={mergedPRs || []} />
      </SimpleGrid>
    </Container>
  );
}
