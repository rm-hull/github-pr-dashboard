import { Badge, Button, CloseButton, Dialog, Link, Portal, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useMergePullRequest } from "@/hooks/useMergePullRequest";
import { usePullRequestDetail } from "@/hooks/usePullRequestDetail";

interface MergeButtonProps {
  owner: string;
  repo: string;
  pull_number: number;
  state: string;
  url: string;
}

const DO_NOT_MERGE_NORMALIZED = "DONOTMERGE";

export function MergeButton({ owner, repo, pull_number, state, url }: MergeButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, error } = useMergePullRequest();
  const { data } = usePullRequestDetail(owner, repo, pull_number);
  const disabled = isPending || state === "closed";

  useErrorToast(
    `merge-error-${owner}-${repo}-${pull_number}`,
    `Failed to merge: ${owner}/${repo} #${pull_number}`,
    error
  );

  const hasDoNotMergeLabel = data?.labels?.some((label) => {
    const name = typeof label === "string" ? label : label.name;
    // Normalize by uppercasing and stripping spaces, hyphens, and underscores
    // so "DO NOT MERGE", "do-not-merge", "do_not_merge", etc. all match
    return name?.toUpperCase().replace(/[-_\s]/g, "") === DO_NOT_MERGE_NORMALIZED;
  });

  const handleMerge = () => {
    if (hasDoNotMergeLabel || (state !== "closed" && data?.mergeable_state !== "clean")) {
      setOpen(true);
      return;
    }
    mutate({ owner, repo, pull_number });
  };

  const handleMergeConfirmed = () => {
    setOpen(false);
    mutate({ owner, repo, pull_number });
  };

  return (
    <>
      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  Pull Request{" "}
                  <Link colorPalette="blue" href={url} fontWeight="bold" target="_blank" rel="noopener noreferrer">
                    {owner}/{repo} #{pull_number}
                  </Link>
                  {hasDoNotMergeLabel ? <> has "DO NOT MERGE" label</> : <> is {data?.mergeable_state}</>}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {hasDoNotMergeLabel ? (
                  <Text>
                    The author has marked this pull request with a <Badge colorPalette="red">DO NOT MERGE</Badge> label.
                    They likely did not intend for this to be merged yet. Are you sure you want to proceed?
                  </Text>
                ) : (
                  <Text>
                    Are you sure you want to merge this pull request? It is not in a clean state and may cause issues.
                  </Text>
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="plain">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button onClick={handleMergeConfirmed}>Confirm Merge</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="xs" variant="plain" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Button onClick={handleMerge} disabled={disabled}>
        Merge
      </Button>
    </>
  );
}
