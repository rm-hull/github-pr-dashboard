import { Box, ButtonGroup, HStack, Image, Link, List, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { RestEndpointMethodTypes } from "@octokit/rest";
import { AnimatePresence, motion } from "framer-motion";
import JavascriptTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useCallback } from "react";
import TimeAgo from "react-time-ago";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";
import { DependabotRebaseButton } from "./actions/DependabotRebaseButton";
import { GeminiReviewButton } from "./actions/GeminiReviewButton";
import { IgnoreButton } from "./actions/IgnoreButton";
import { MergeButton } from "./actions/MergeButton";
import { InfoPopover } from "./InfoPopover";

const MotionListItem = motion(List.Item);

JavascriptTimeAgo.addDefaultLocale(en);

type PullRequest = RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"][0];

type Props = {
  pulls: PullRequest[];
};

export default function PullRequestsList({ pulls }: Props) {
  const { settings, isLoading } = useGeneralSettings();
  const isStacked = useBreakpointValue({ base: true, lg: false });

  const isSelected = useCallback(
    (pull: PullRequest) => {
      if (pull.state !== "open") {
        return false;
      }

      const unignoreTime = settings?.ignores?.[pull.url];
      return unignoreTime === undefined || Date.now() >= unignoreTime;
    },
    [settings]
  );

  if (isLoading) {
    return null;
  }

  return (
    <List.Root gap={2} listStyleType="none">
      <AnimatePresence>
        {pulls.filter(isSelected).map((pull) => {
          const repoFullName = pull.repository_url.split("/repos/")[1];
          const [owner, repo] = repoFullName.split("/");

          return (
            <MotionListItem
              key={pull.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.3 }}
              p={2}
              _hover={{
                bg: "bg.subtle",
                cursor: "pointer",
              }}
            >
              <Stack
                direction={{ base: "column", lg: "row" }}
                justify="space-between"
                alignItems={isStacked ? undefined : "center"}
                gap={2}
              >
                <Box>
                  <HStack alignItems="center" gap={1}>
                    <Link href={pull.html_url} fontWeight="bold">
                      {pull.title}
                    </Link>
                    <InfoPopover title={pull.title} descr={pull.body} />
                  </HStack>

                  <HStack gap={1}>
                    <Text fontSize="sm">
                      {repoFullName} — #{pull.number}
                    </Text>
                    <Image
                      src={pull.user?.avatar_url}
                      ml={3}
                      boxSize="18px"
                      borderRadius="full"
                      fit="cover"
                      border="1px solid"
                      borderColor="fg.subtle"
                    />
                    <Text fontSize="xs" color="fg.subtle" display="flex" flexDir="row" gap={2}>
                      {pull.user?.login} <TimeAgo date={new Date(pull.created_at)} locale="en-US" />
                    </Text>
                  </HStack>
                </Box>
                <ButtonGroup variant="subtle" size="xs">
                  <IgnoreButton url={pull.url} />
                  <MergeButton owner={owner} repo={repo} pull_number={pull.number} />
                  <DependabotRebaseButton owner={owner} repo={repo} pull_number={pull.number} user={pull.user?.login} />
                  <GeminiReviewButton owner={owner} repo={repo} pull_number={pull.number} user={pull.user?.login} />
                </ButtonGroup>
              </Stack>
            </MotionListItem>
          );
        })}
      </AnimatePresence>
    </List.Root>
  );
}
