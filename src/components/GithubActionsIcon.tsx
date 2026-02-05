import { Box, Link, Spinner } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import TimeAgo from "javascript-time-ago";
import { useRef } from "react";
import { IoAlertCircle, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { RiProgress6Line } from "react-icons/ri";
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
    tooltip = `Last ${data.branch} run: ${data.conclusion ?? data.status} (${age})`;
  }

  return (
    <Box ref={ref}>
      <Tooltip content={tooltip}>
        <Link href={data?.htmlUrl} target="_blank">
          {icon(isLoading, data?.conclusion ?? data?.status ?? "unknown")}
        </Link>
      </Tooltip>
    </Box>
  );
}

function icon(isLoading: boolean, conclusion: string) {
  if (isLoading) {
    return <Spinner size="xs" color="fg.info" />;
  }

  return (
    <Box display="inline-flex" alignItems="center" justifyContent="center" position="relative">
      <Box bg="white" w="12px" h="12px" borderRadius="full" position="absolute" />
      {getIcon(conclusion)}
    </Box>
  );
}

function getIcon(conclusion: string) {
  switch (conclusion) {
    case "success":
      return <IoCheckmarkCircle size={18} color="green" style={{ position: "relative" }} />;
    case "failure":
      return <IoCloseCircle size={18} color="red" style={{ position: "relative" }} />;
    case "in_progress":
    case "queued":
      return <RiProgress6Line size={18} color="grey" style={{ position: "relative" }} />;
    case "unknown":
    default:
      return <IoAlertCircle size={18} color="purple" style={{ position: "relative" }} />;
  }
}
