import { Button, Spinner } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { RxCross2, RxCheck, RxQuestionMark } from "react-icons/rx";
import { useMergePullRequest } from "@/hooks/useMergePullRequest";
import { usePullRequestDetail } from "@/hooks/usePullRequestDetail";

interface MergeButtonProps {
  owner: string;
  repo: string;
  pull_number: number;
}

export function MergeButton({ owner, repo, pull_number }: MergeButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { data, isLoading } = usePullRequestDetail(owner, repo, pull_number, { isActive: isInView });
  const { mutate, isPending } = useMergePullRequest();
  const disabled = data?.mergeable_state !== "clean" || isPending;

  return (
    <Button ref={ref} onClick={() => mutate({ owner, repo, pull_number })} disabled={disabled}>
      Merge
      {isLoading && <Spinner size="sm" color="fg.info" />}
      {!isLoading && !data && <RxQuestionMark color="purple" />}
      {data?.mergeable_state === "clean" && <RxCheck color="green" />}
      {data?.mergeable_state === "unstable" && <RxCross2 color="red" />}
      {data?.mergeable_state === "blocked" && <RxCross2 color="red" />}
      {data?.mergeable_state === "dirty" && <RxCross2 color="red" />}
      {data?.mergeable_state === "behind" && <RxCross2 color="red" />}
      {data?.mergeable_state === "unknown" && <RxQuestionMark color="purple" />}
    </Button>
  );
}
