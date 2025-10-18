import { Box, ButtonGroup, HStack, Image, Link, List, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import JavascriptTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import TimeAgo from "react-time-ago";
import { PullRequest } from "@/types";
import { DependabotRebaseButton } from "./actions/DependabotRebaseButton";
import { GeminiReviewButton } from "./actions/GeminiReviewButton";
import { IgnoreButton } from "./actions/IgnoreButton";
import { MergeButton } from "./actions/MergeButton";
import { InfoPopover } from "./InfoPopover";
import { SearchHighlight } from "./SearchHighlight";
import { StatusIcon } from "./StatusIcon";

const MotionListItem = motion.create(List.Item);

JavascriptTimeAgo.addDefaultLocale(en);

interface PullRequestListItemProps {
  pull: PullRequest;
  isStacked?: boolean;
  searchTerm?: string;
}

export function PullRequestListItem({ pull, isStacked, searchTerm }: PullRequestListItemProps) {
  const repoFullName = pull.repository_url.split("/repos/")[1];
  const [owner, repo] = repoFullName.split("/");

  return (
    <MotionListItem
      key={pull.id}
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2 }}
      p={2}
      _hover={{
        bg: "bg.subtle",
      }}
    >
      <Stack
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        alignItems={isStacked ? undefined : "center"}
        gap={2}
      >
        <InfoPopover title={pull.title} descr={pull.body} width={isStacked ? "md" : "lg"}>
          <Box cursor={pull.body ? "pointer" : undefined}>
            <HStack alignItems="center" gap={2}>
              <Link href={pull.html_url} fontWeight="bold" target="_blank" rel="noopener noreferrer">
                <SearchHighlight query={searchTerm}>{pull.title}</SearchHighlight>
              </Link>
              <StatusIcon owner={owner} repo={repo} pull_number={pull.number} />
            </HStack>

            <HStack gap={1}>
              <Text fontSize="sm">
              <SearchHighlight query={searchTerm}>
                  {repoFullName} — #{pull.number}
              </SearchHighlight>
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
        </InfoPopover>
        <ButtonGroup variant="subtle" size="xs">
          <IgnoreButton url={pull.url} />
          <MergeButton owner={owner} repo={repo} pull_number={pull.number} />
          <DependabotRebaseButton owner={owner} repo={repo} pull_number={pull.number} user={pull.user?.login} />
          <GeminiReviewButton owner={owner} repo={repo} pull_number={pull.number} user={pull.user?.login} />
        </ButtonGroup>
      </Stack>
    </MotionListItem>
  );
}
