import { Container, SimpleGrid, Heading, Spinner, Center, Text, Box, Stack, Separator } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { MergedPrsOverTimeChart } from "@/components/metrics/MergedPrsOverTimeChart";
import { MergeTimeDistributionChart } from "@/components/metrics/MergeTimeDistributionChart";
import { PrAgeDistributionChart } from "@/components/metrics/PrAgeDistributionChart";
import { PrsByRepoChart } from "@/components/metrics/PrsByRepoChart";
import { DraftVsReadyChart } from "../../components/metrics/DraftVsReadyChart";
import { useAllPullRequests } from "../../hooks/useAllPullRequests";

export const Route = createFileRoute("/github-pr-dashboard/stats")({
  component: RouteComponent,
});

function RouteComponent() {
  const { allPullRequests: openPRs, isLoading: isLoadingOpen, error: errorOpen } = useAllPullRequests("open");
  const { allPullRequests: mergedPRs, isLoading: isLoadingMerged, error: errorMerged } = useAllPullRequests("merged");

  if (isLoadingOpen || isLoadingMerged) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (errorOpen || errorMerged) {
    return (
      <Center h="50vh">
        <Text color="red.500">Failed to load stats.</Text>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Stack gap={8}>
        <Box>
          <Heading mb={6}>Open Pull Request Statistics</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <PrsByRepoChart pullRequests={openPRs || []} title="Open PRs by Repository" />
            <DraftVsReadyChart pullRequests={openPRs || []} />
            <Box gridColumn={{ md: "span 2" }}>
              <PrAgeDistributionChart pullRequests={openPRs || []} />
            </Box>
          </SimpleGrid>
        </Box>

        <Separator />

        <Box>
          <Heading mb={6}>Merged Pull Request Statistics</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <PrsByRepoChart pullRequests={mergedPRs || []} title="Merged PRs by Repository" />
            <MergeTimeDistributionChart pullRequests={mergedPRs || []} />
            <Box gridColumn={{ md: "span 2" }}>
              <MergedPrsOverTimeChart pullRequests={mergedPRs || []} />
            </Box>
          </SimpleGrid>
        </Box>
      </Stack>
    </Container>
  );
}
