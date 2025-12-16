import { Box, Link, Spinner } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import TimeAgo from "javascript-time-ago";
import { useRef } from "react";
import { RxCheck, RxCross2, RxQuestionMark } from "react-icons/rx";
import { useLatestActionsStatus } from "@/hooks/useLatestActionsStatus";
import { Tooltip } from "./ui/tooltip";

const timeAgo = new TimeAgo("en-US");

interface GithubActionsProps {
  owner: string;
  repo: string;
}

export function GithubActionsIcon({ owner, repo }: GithubActionsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { data, isLoading } = useLatestActionsStatus(owner, repo, { isActive: isInView });

  let tooltip = "unknown";
  if (data) {
    const age = timeAgo.format(new Date(data.createdAt));
    tooltip = `Last ${data.branch} run: ${data.conclusion} (${age})`;
  }

  return (
    <Box ref={ref}>
      <Tooltip content={tooltip}>
        <Link href={data?.htmlUrl} target="_blank">
          {icon(isLoading, data?.conclusion)}
        </Link>
      </Tooltip>
    </Box>
  );
}

function icon(isLoading: boolean, conclusion: string | null) {
  if (isLoading) {
    return <Spinner size="xs" color="fg.info" />;
  }

  switch (conclusion) {
    case "success":
      return <RxCheck size={16} color="green" />;
    case "failure":
      return <RxCross2 size={16} color="red" />;
    case "unknown":
    default:
      return <RxQuestionMark size={16} color="purple" />;
  }
}
