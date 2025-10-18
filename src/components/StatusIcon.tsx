import { Box, Spinner } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { IoWarning } from "react-icons/io5";
import { RxCheck, RxCross2, RxQuestionMark } from "react-icons/rx";
import { usePullRequestDetail } from "@/hooks/usePullRequestDetail";
import { Tooltip } from "./ui/tooltip";

interface StatusIconProps {
  owner: string;
  repo: string;
  pull_number: number;
}

export function StatusIcon({ owner, repo, pull_number }: StatusIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { data, isLoading } = usePullRequestDetail(owner, repo, pull_number, { isActive: isInView });

  return (
    <Box ref={ref}>
      <Tooltip content={data?.mergeable_state}>{icon(isLoading, data?.mergeable_state)}</Tooltip>
    </Box>
  );
}

function icon(isLoading: boolean, state?: string) {
  if (isLoading) {
    return <Spinner size="xs" color="fg.info" />;
  }

  switch (state) {
    case "clean":
      return <RxCheck color="green" />;
    case "behind":
    case "unstable":
      return <IoWarning color="orange" />;
    case "blocked":
    case "dirty":
      return <RxCross2 color="red" />;
    case "unknown":
    default:
      return <RxQuestionMark color="purple" />;
  }
}
