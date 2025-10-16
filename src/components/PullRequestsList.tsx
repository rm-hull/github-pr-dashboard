import { Box, Heading, List, useBreakpointValue } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";
import { PullRequest } from "@/types";
import { ListFooter } from "./ListFooter";
import { PullRequestListItem } from "./PullRequestListItem";

type Props = {
  pulls: PullRequest[];
};

const selector = {
  recent: () => null,
  "by-repo": (pull: PullRequest) => pull.repository_url,
};

export default function PullRequestsList({ pulls }: Props) {
  const { settings, isLoading } = useGeneralSettings();
  const isStacked = useBreakpointValue({ base: true, lg: false });
  const [select, setSelect] = useState<string | null>("recent");

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

  const pullsBySelector: Record<string, PullRequest[]> = useMemo(
    () => Object.groupBy(pulls.filter(isSelected), selector[select]),
    [pulls, isSelected, select]
  );

  return (
    <>
      <List.Root gap={2} listStyleType="none" mb={8}>
        <AnimatePresence>
          {Object.entries(pullsBySelector).map(([groupBy, pulls]) => {
            const repoFullName = groupBy.split("/repos/")[1];
            return (
              <Box key={repoFullName}>
                {groupBy && <Heading>{repoFullName}</Heading>}
                {pulls.map((pull) => (
                  <PullRequestListItem key={pull.id} pull={pull} isStacked={isStacked} />
                ))}
              </Box>
            );
          })}
        </AnimatePresence>
      </List.Root>
      <ListFooter onSelect={setSelect} />
    </>
  );
}
