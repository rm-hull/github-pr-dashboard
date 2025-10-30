import { Box, For, Heading, List, Separator, useBreakpointValue } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import Favicon from "react-favicon";
import { FaGitAlt } from "react-icons/fa";
import { ListViewBy, useGeneralSettings } from "@/hooks/useGeneralSettings";
import { PullRequest } from "@/utils/types";
import { ListFooter } from "./ListFooter";
import { NoSearchMatches } from "./NoSearchMatches";
import { Breakpoint, PullRequestListItem } from "./PullRequestListItem";

type PullRequestListProps = {
  pulls: PullRequest[];
};

const selector: Record<ListViewBy, (pull: PullRequest) => string | null> = {
  recent: () => null,
  repo: (pull: PullRequest) => pull.repository_url,
};

export default function PullRequestsList({ pulls }: PullRequestListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { settings, isLoading } = useGeneralSettings();
  const breakpoint = useBreakpointValue<Breakpoint>({ base: "base", md: "md", lg: "lg" });
  const listViewBy = settings?.listViewBy || "recent";

  const isSelected = useCallback(
    (pull: PullRequest) => {
      if (pull.state !== "open") {
        return false;
      }

      const unignoreTime = settings?.ignores?.[pull.url];
      const shouldIgnore = unignoreTime !== undefined && Date.now() <= unignoreTime;
      if (shouldIgnore) {
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
    [settings, searchTerm]
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

      <Favicon url={`${window.location.href}/favicon.ico`} alertCount={alertCount} iconSize={32} />
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
