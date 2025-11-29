import { Box, Container, Progress } from "@chakra-ui/react";
import PullRequestsList from "@/components/PullRequestsList";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useErrorToast } from "@/hooks/useErrorToast";
import { usePullRequests } from "@/hooks/usePullRequests";
import { alpha } from "@/utils/alpha";

interface PullRequestPageProps {
  prState: string;
  listState: string;
  enableNotifications?: boolean;
}

export function PullRequestPage({ prState, listState, enableNotifications }: PullRequestPageProps) {
  const { data, isFetching, isEnabled, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePullRequests(prState);
  useErrorToast("pull-requests", `Failed to fetch ${prState} pull requests`, error);

  const bgOpacity = 0.85;
  const bgColor = useColorModeValue(
    alpha("blue.50", bgOpacity), // light
    alpha("blue.900", bgOpacity) // dark
  );

  const allPullRequests = data?.pages || [];

  return (
    <>
      {isEnabled && (
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
          {(isFetching || isFetchingNextPage) && (
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          )}
        </Progress.Root>
      )}
      {allPullRequests.length > 0 && (
        <Box minHeight="calc(100vh - 3rem)" position="relative">
          <Box position="absolute" inset={0} bg={bgColor} backdropFilter="saturate(180%) blur(5px)" />
          <Container py={2} maxW="full" position="relative">
            <PullRequestsList
              pulls={allPullRequests}
              state={listState}
              enableNotifications={enableNotifications}
              fetchNextPage={() => void fetchNextPage()}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </Container>
        </Box>
      )}
    </>
  );
}
