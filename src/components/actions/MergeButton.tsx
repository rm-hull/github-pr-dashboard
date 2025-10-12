import { Button, Spinner } from "@chakra-ui/react";
import { RxCross2, RxCheck, RxQuestionMark } from "react-icons/rx";
import { usePullRequestDetail } from "@/hooks/usePullRequestDetail";
import { useMergePullRequest } from "@/hooks/useMergePullRequest";

interface MergeButtonProps {
  owner: string;
  repo: string;
  pull_number: number;
  active: boolean;
}

export function MergeButton({ owner, repo, pull_number, active }: MergeButtonProps) {
  const { data, isLoading } = usePullRequestDetail(owner, repo, pull_number, active);
  const { mutate, isPending } = useMergePullRequest();
  const disabled = data?.mergeable_state !== "clean" || isPending;

  return (
    <Button onClick={() => mutate({ owner, repo, pull_number })} disabled={disabled}>
      Merge
      {isLoading && <Spinner size="sm" color="fg.info" />}
      {!isLoading && !data && <RxQuestionMark color="purple" />}
      {data?.mergeable_state === "clean" && <RxCheck color="green" />}
      {data?.mergeable_state === "unstable" && <RxCross2 color="red" />}
      {data?.mergeable_state === "blocked" && <RxCross2 color="red" />}
      {data?.mergeable_state === "dirty" && <RxCross2 color="red" />}
    </Button>
  );
}
