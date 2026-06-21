import { Box, HStack, Link, List, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import JavascriptTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import TimeAgo from "react-time-ago";
import { alpha } from "@/utils/alpha";
import { PullRequest } from "@/utils/types";
import { CommentCount } from "./CommentCount";
import { GithubLabels } from "./GithubLabels";
import { InfoPopover } from "./InfoPopover";
import { InlineCodeText } from "./InlineCodeText";
import { Breakpoint } from "./PullRequestListItem";
import { SearchHighlight } from "./SearchHighlight";
import { UserDetails } from "./UserDetails";

const MotionListItem = motion.create(List.Item);

JavascriptTimeAgo.addDefaultLocale(en);

interface IssueListItemProps {
  issue: PullRequest;
  breakpoint?: Breakpoint;
  searchTerm?: string;
}

export function IssueListItem({ issue, breakpoint, searchTerm }: IssueListItemProps) {
  const repoFullName = issue.repository_url.split("/repos/")[1];
  const [owner, repo] = repoFullName.split("/");

  return (
    <MotionListItem
      key={issue.id}
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2 }}
      p={2}
      _hover={{
        bg: alpha("bg.subtle", 0.4),
        borderColor: "blackAlpha.200",
      }}
      border="1px solid transparent"
      borderRadius={5}
    >
      <Stack
        direction={breakpoint === "base" ? "column" : "row"}
        justify="space-between"
        alignItems={breakpoint === "base" ? undefined : "center"}
        gap={2}
      >
        <InfoPopover
          title={issue.title}
          descr={issue.body}
          width={breakpoint === "base" ? "md" : "lg"}
          owner={owner}
          repo={repo}
        >
          <Box cursor={issue.body ? "pointer" : undefined}>
            <HStack alignItems="center" gap={2}>
              <Link href={issue.html_url} fontWeight="bold" target="_blank" rel="noopener noreferrer">
                <Text as="span" truncate maxW={breakpoint === "lg" ? undefined : "320px"}>
                  <InlineCodeText>
                    <SearchHighlight query={searchTerm}>{issue.title}</SearchHighlight>
                  </InlineCodeText>
                </Text>
              </Link>
            </HStack>

            <HStack gapX={4} gapY={0} flexWrap="wrap">
              <Text as="span" fontSize="sm">
                <SearchHighlight query={searchTerm}>
                  {repoFullName} — {"#" + issue.number}
                </SearchHighlight>
              </Text>

              <UserDetails user={issue.user} searchTerm={searchTerm} />
              <Text as="span" fontSize="xs" color="fg.subtle">
                <TimeAgo date={new Date(issue.created_at)} locale="en-US" />
              </Text>
              <CommentCount owner={owner} repo={repo} pull_number={issue.number} />
              <GithubLabels labels={issue.labels} />
            </HStack>
          </Box>
        </InfoPopover>
      </Stack>
    </MotionListItem>
  );
}
