import { Box, Container, Progress } from "@chakra-ui/react";
import PullRequestsList from "@/components/PullRequestsList";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useErrorToast } from "@/hooks/useErrorToast";
import { usePullRequests } from "@/hooks/usePullRequests";
import { alpha } from "@/utils/alpha";

interface PullRequestPageProps {
  prState: string;
  listState: string;
  bgOpacity?: number;
  enableNotifications?: boolean;
}

export function PullRequestPage({ prState, listState, bgOpacity = 0.85, enableNotifications }: PullRequestPageProps) {
  const { data, isFetching, isEnabled, error } = usePullRequests(prState);
  useErrorToast("pull-requests", `Failed to fetch ${prState} pull requests`, error);

  const bgColor = useColorModeValue(
    alpha("blue.50", bgOpacity), // light
    alpha("blue.900", bgOpacity) // dark
  );

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
          {isFetching && (
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          )}
        </Progress.Root>
      )}
      {data && (
        <Box minHeight="calc(100vh - 3rem)" position="relative">
          <Box position="absolute" inset={0} bg={bgColor} backdropFilter="saturate(180%) blur(5px)" />
          <Container py={2} maxW="full" position="relative">
            <PullRequestsList pulls={data} state={listState} enableNotifications={enableNotifications} />
          </Container>
        </Box>
      )}
    </>
  );
}
