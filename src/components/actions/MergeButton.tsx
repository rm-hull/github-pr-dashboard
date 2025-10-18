import { Button } from "@chakra-ui/react";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useMergePullRequest } from "@/hooks/useMergePullRequest";

interface MergeButtonProps {
  owner: string;
  repo: string;
  pull_number: number;
}

export function MergeButton({ owner, repo, pull_number }: MergeButtonProps) {
  const { mutate, isPending, error } = useMergePullRequest();
  const disabled = /*data?.mergeable_state !== "clean" ||*/ isPending;

  useErrorToast("merge-error", "Failed to merge pull request", error);

  return (
    <Button onClick={() => mutate({ owner, repo, pull_number })} disabled={disabled}>
      Merge
    </Button>
  );
}
