import { Box, Container, Progress, SimpleGrid } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { MergedPrsOverTimeChart } from "@/components/metrics/MergedPrsOverTimeChart";
import { MergeTimeDistributionChart } from "@/components/metrics/MergeTimeDistributionChart";
import { PrAgeDistributionChart } from "@/components/metrics/PrAgeDistributionChart";
import { PrsByRepoChart } from "@/components/metrics/PrsByRepoChart";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useErrorToast } from "@/hooks/useErrorToast";
import { alpha } from "@/utils/alpha";
import { DraftVsReadyChart } from "../../components/metrics/DraftVsReadyChart";
import { usePullRequests } from "@/hooks/usePullRequests";

export const Route = createFileRoute("/github-pr-dashboard/stats")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: openPRs, isLoading: isLoadingOpen, error: errorOpen } = usePullRequests("open", { fetchAll: true });
  const {
    data: mergedPRs,
    isLoading: isLoadingMerged,
    error: errorMerged,
  } = usePullRequests("merged", { fetchAll: true });

  useErrorToast("stats", "Failed to fetch pull request details", errorOpen || errorMerged);

  const bgOpacity = 0.85;
  const bgColor = useColorModeValue(
    alpha("blue.50", bgOpacity), // light
    alpha("blue.900", bgOpacity) // dark
  );

  if (isLoadingOpen || isLoadingMerged) {
    return (
      <Progress.Root
        variant="subtle"
        width="full"
        value={null}
        colorPalette="blue"
        size="xs"
        height="5px"
        bg={bgColor}
        backdropFilter="saturate(180%) blur(5px)"
      >
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    );
  }

  return (
    <Box minHeight="calc(100vh - 3rem)" position="relative">
      <Box position="absolute" inset={0} bg={bgColor} backdropFilter="saturate(180%) blur(5px)" />
      <Container py={6} maxW="full" position="relative">
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
          <PrsByRepoChart pullRequests={openPRs?.pages || []} title="Open PRs by Repository" />
          <DraftVsReadyChart pullRequests={openPRs?.pages || []} />
          <PrAgeDistributionChart pullRequests={openPRs?.pages || []} />
          <PrsByRepoChart pullRequests={mergedPRs?.pages || []} title="Merged PRs by Repository" />
          <MergeTimeDistributionChart pullRequests={mergedPRs?.pages || []} />
          <MergedPrsOverTimeChart by="week" pullRequests={mergedPRs?.pages || []} />
        </SimpleGrid>
      </Container>
    </Box>
  );
}
