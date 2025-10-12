import { Button, Spinner } from "@chakra-ui/react";
import { TiTick } from "react-icons/ti";
import { LiaSkullCrossbonesSolid } from "react-icons/lia";
import { MdQuestionMark } from "react-icons/md";
import { usePullRequestDetail } from "@/hooks/usePullRequestDetail";
import { MdOutlineBlock } from "react-icons/md";
import { useMergePullRequest } from "@/hooks/useMergePullRequest";

interface MergeButtonProps {
  owner: string;
  repo: string;
  pull_number: number;
  active: boolean;
}

export function MergeButton({ owner, repo, pull_number, active }: MergeButtonProps) {
  const { data, isLoading } = usePullRequestDetail(owner, repo, pull_number, active);
  const { mutate } = useMergePullRequest();
  const disabled = data?.mergeable_state !== "clean";

  return (
    <Button size="sm" onClick={() => mutate({ owner, repo, pull_number })} disabled={disabled} variant="subtle">
      Merge
      {isLoading && <Spinner size="sm" color="fg.info" />}
      {!isLoading && !data && <MdQuestionMark color="purple" />}
      {data?.mergeable_state === "clean" && <TiTick color="green" />}
      {data?.mergeable_state === "unstable" && <LiaSkullCrossbonesSolid color="red" />}
      {data?.mergeable_state === "blocked" && <MdOutlineBlock color="red" />}
    </Button>
  );
}
