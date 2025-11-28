import { Box, For, Heading, List, Separator, useBreakpointValue } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import Favicon from "react-favicon";
import { FaGitAlt } from "react-icons/fa";
import { ListViewBy, useGeneralSettings } from "@/hooks/useGeneralSettings";
import { PullRequest } from "@/utils/types";
import { ListFooter } from "./ListFooter";
import { NoSearchMatches } from "./NoSearchMatches";
import { Notifications } from "./Notifications";
import { Breakpoint, PullRequestListItem } from "./PullRequestListItem";

type PullRequestListProps = {
  pulls: PullRequest[];
  state: string;
  enableNotifications?: boolean;
};

const selector: Record<ListViewBy, (pull: PullRequest) => string | null> = {
  recent: () => null,
  repo: (pull: PullRequest) => pull.repository_url,
};

function isBefore(pull: PullRequest, cutoffDate?: number) {
  if (!cutoffDate) {
    return false;
  }

  return new Date(pull.created_at).getTime() < cutoffDate;
}

export default function PullRequestsList({ pulls, state, enableNotifications = false }: PullRequestListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { settings, isLoading } = useGeneralSettings();
  const breakpoint = useBreakpointValue<Breakpoint>({ base: "base", md: "md", lg: "lg" });
  const listViewBy = settings?.listViewBy || "recent";
  const ignoredRepos = useMemo(() => new Set(settings?.ignored?.repos || []), [settings?.ignored?.repos]);

  const isSelected = useCallback(
    (pull: PullRequest) => {
      if (pull.state !== state || pull.draft || isBefore(pull, settings?.cutoffDate)) {
        return false;
      }

      const repoFullName = pull.repository_url.split("/repos/")[1];
      if (ignoredRepos.has(repoFullName)) {
        return false;
      }

      const unignoreTime = settings?.ignored?.prs?.[pull.url];
      const shouldIgnorePR = unignoreTime !== undefined && Date.now() <= unignoreTime;
      if (shouldIgnorePR) {
        return false;
      }

      if (searchTerm?.length > 0) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
          pull.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          pull.repository_url.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }

      return true;
    },
    [settings, searchTerm, ignoredRepos, state]
  );

  const pullsBySelector = useMemo(() => {
    return pulls.filter(isSelected).reduce<Record<string, PullRequest[]>>((acc, pr) => {
      const key = selector[listViewBy](pr) ?? "";
      if (!acc[key]) acc[key] = [];
      acc[key].push(pr);
      return acc;
    }, {});
  }, [pulls, isSelected, listViewBy]);

  const count = useMemo(() => Object.values(pullsBySelector).flat().length, [pullsBySelector]);

  if (isLoading) {
    return null;
  }

  const alertCount = count === 0 ? undefined : count > 9 ? "+" : count;

  return (
    <>
      {count === 0 && <NoSearchMatches />}

      {enableNotifications && (
        <>
          <Notifications count={count} />
          <Favicon url={`${import.meta.env.BASE_URL}/favicon.ico`} alertCount={alertCount} iconSize={32} />
        </>
      )}
      <List.Root gap={2} listStyleType="none" pb={12}>
        <AnimatePresence>
          {Object.entries(pullsBySelector).flatMap(([groupBy, pulls], index, array) => {
            const repoFullName = groupBy.split("/repos/")[1];
            const isLast = index === array.length - 1;
            return (
              <Box key={repoFullName}>
                {!!repoFullName && (
                  <Heading fontSize="2xl" py={1} mb={1} color="fg.info" display="flex" alignItems="center" gap={2}>
                    <FaGitAlt size={24} />
                    {repoFullName}
                  </Heading>
                )}
                <For each={pulls}>
                  {(pull) => (
                    <PullRequestListItem key={pull.id} pull={pull} breakpoint={breakpoint} searchTerm={searchTerm} />
                  )}
                </For>
                {!isLast && <Separator mt={2} />}
              </Box>
            );
          })}
        </AnimatePresence>
      </List.Root>
      <ListFooter onSearch={setSearchTerm} />
    </>
  );
}
