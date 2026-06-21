import { ReactNode } from "react";
import { format, parseISO } from "date-fns";
import { FaRegCalendarAlt, FaGitAlt } from "react-icons/fa";
import { MdOutlineLabel } from "react-icons/md";
import { ListViewBy } from "@/hooks/useGeneralSettings";
import { PullRequest } from "@/utils/types";

export const listSelector: Record<ListViewBy, (item: PullRequest) => string[]> = {
  recent: (item: PullRequest) => [format(parseISO(item.created_at), "MMM yyyy")],
  repo: (item: PullRequest) => [item.repository_url],
  label: (item: PullRequest) =>
    !item.labels?.length ? ["[unlabelled]"] : item.labels.map((label) => label.name ?? "unknown"),
};

export const listSelectorIcons: Record<ListViewBy, ReactNode> = {
  recent: <FaRegCalendarAlt size={24} />,
  repo: <FaGitAlt size={24} />,
  label: <MdOutlineLabel size={24} />,
};
