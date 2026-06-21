import { Box, Button, For, Heading, List, Separator, useBreakpointValue } from "@chakra-ui/react";
import { compareDesc, parseISO } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";
import { isBefore } from "@/utils/date";
import { groupBySelector } from "@/utils/grouping";
import { listSelector, listSelectorIcons } from "@/utils/list-selectors";
import { PullRequest } from "@/utils/types";
import { GithubActionsIcon } from "./GithubActionsIcon";
import { IssueListItem } from "./IssueListItem";
import { ListFooter } from "./ListFooter";
import { NoSearchMatches } from "./NoSearchMatches";
import { Breakpoint } from "./PullRequestListItem";

type IssuesListProps = {
  issues: PullRequest[];
  state: string;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
};

export default function IssuesList({ issues, state, fetchNextPage, hasNextPage, isFetchingNextPage }: IssuesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { settings, isLoading } = useGeneralSettings();
  const breakpoint = useBreakpointValue<Breakpoint>({ base: "base", md: "md", lg: "lg" });
  const listViewBy = settings?.listViewBy || "recent";
  const ignoredRepos = useMemo(() => new Set(settings?.ignored?.repos || []), [settings?.ignored?.repos]);

  const isSelected = useCallback(
    (issue: PullRequest) => {
      if (issue.state !== state || isBefore(issue, settings?.cutoffDate)) {
        return false;
      }

      const repoFullName = issue.repository_url.split("/repos/")[1];
      if (ignoredRepos.has(repoFullName)) {
        return false;
      }

      if (searchTerm?.length > 0) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
          issue.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          issue.repository_url.toLowerCase().includes(lowerCaseSearchTerm) ||
          issue.user?.login.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }

      return true;
    },
    [searchTerm, ignoredRepos, state, settings]
  );

  const issuesBySelector = useMemo(() => {
    return groupBySelector(
      issues.filter(isSelected).sort((a, b) => compareDesc(parseISO(a.created_at), parseISO(b.created_at))),
      (issue) => listSelector[listViewBy](issue)
    );
  }, [issues, isSelected, listViewBy]);

  const count = useMemo(() => Object.values(issuesBySelector).flat().length, [issuesBySelector]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      {count === 0 && <NoSearchMatches />}

      <List.Root gap={2} listStyleType="none" pb={12}>
        <AnimatePresence>
          {Object.entries(issuesBySelector).flatMap(([groupBy, groupedIssues], index, array) => {
            const isRepoGroup = groupBy.includes("/repos/");
            const repoFullName = isRepoGroup ? groupBy.split("/repos/")[1] : undefined;
            const [owner, repo] = repoFullName?.split("/") ?? [];
            const isLast = index === array.length - 1;
            return (
              <Box key={groupBy}>
                {(!!repoFullName || !isRepoGroup) && (
                  <Heading fontSize="2xl" py={1} mb={1} color="fg.info" display="flex" alignItems="center" gap={2}>
                    {listSelectorIcons[listViewBy]}
                    {repoFullName ?? groupBy}
                    {isRepoGroup && <GithubActionsIcon owner={owner} repo={repo} />}
                  </Heading>
                )}
                <For each={groupedIssues}>
                  {(issue) => (
                    <IssueListItem key={issue.id} issue={issue} breakpoint={breakpoint} searchTerm={searchTerm} />
                  )}
                </For>
                {!isLast && <Separator mt={2} />}
              </Box>
            );
          })}
        </AnimatePresence>
        {hasNextPage && (
          <Box py={4} textAlign="center">
            <Button
              variant="surface"
              colorPalette="blue"
              size="sm"
              loading={isFetchingNextPage}
              loadingText="Fetching..."
              onClick={fetchNextPage}
            >
              Load More
            </Button>
          </Box>
        )}
      </List.Root>
      <ListFooter onSearch={setSearchTerm} />
    </>
  );
}
