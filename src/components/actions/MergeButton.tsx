import { Button } from "@chakra-ui/react";
import { useCallback } from "react";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useMergePullRequest } from "@/hooks/useMergePullRequest";

interface MergeButtonProps {
  owner: string;
  repo: string;
  pull_number: number;
  state: string;
}

export function MergeButton({ owner, repo, pull_number, state }: MergeButtonProps) {
  const { mutate, isPending, error } = useMergePullRequest();
  const disabled = /*data?.mergeable_state !== "clean" ||*/ isPending || state === "closed";

  useErrorToast("merge-error", "Failed to merge pull request", error);

  const handleMerge = useCallback(() => {
    mutate({ owner, repo, pull_number });
  }, [mutate, owner, repo, pull_number]);
  return (
    <Button onClick={handleMerge} disabled={disabled}>
      Merge
    </Button>
  );
}
