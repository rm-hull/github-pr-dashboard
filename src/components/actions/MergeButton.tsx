import { Button, CloseButton, Dialog, Link, Portal, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
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

export function MergeButton({ owner, repo, pull_number, state, url }: MergeButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, error } = useMergePullRequest();
  const { data } = usePullRequestDetail(owner, repo, pull_number);
  const disabled = isPending || state === "closed";

  useErrorToast("merge-error", "Failed to merge pull request", error);

  const handleMerge = () => {
    if (state !== "closed" && data?.mergeable_state !== "clean") {
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
                  <Link href={url} fontWeight="bold" target="_blank" rel="noopener noreferrer">
                    {owner}/{repo} #{pull_number}
                  </Link>{" "}
                  is {data?.mergeable_state}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>Are you sure you want to merge this pull request?</Text>
                <Text>It is not in a clean state and may cause issues.</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="plain">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button onClick={handleMergeConfirmed}>Confirm</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
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
