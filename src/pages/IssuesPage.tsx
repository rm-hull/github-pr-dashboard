import { Box, Container, Progress } from "@chakra-ui/react";
import IssuesList from "@/components/IssuesList";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useIssues } from "@/hooks/useIssues";
import { alpha } from "@/utils/alpha";

interface IssuesPageProps {
  issueState: string;
  listState: string;
}

export function IssuesPage({ issueState, listState }: IssuesPageProps) {
  const { data, isFetching, isEnabled, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useIssues(issueState, {
    refetchInBackground: true,
  });
  useErrorToast("issues", `Failed to fetch ${issueState} issues`, error);

  const bgOpacity = 0.85;
  const bgColor = useColorModeValue(
    alpha("blue.50", bgOpacity), // light
    alpha("blue.900", bgOpacity) // dark
  );

  const allIssues = data?.pages || [];

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
      {allIssues.length > 0 && (
        <Box minHeight="calc(100vh - 3rem)" position="relative">
          <Box position="absolute" inset={0} bg={bgColor} backdropFilter="saturate(180%) blur(5px)" />
          <Container py={2} maxW="full" position="relative">
            <IssuesList
              issues={allIssues}
              state={listState}
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
