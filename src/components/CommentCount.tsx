import { usePullRequestDetail } from "@/hooks/usePullRequestDetail";
import { HStack } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { IoChatboxOutline } from "react-icons/io5";

type CommentCountProps = {
  owner: string;
  repo: string;
  pull_number: number;
};

export function CommentCount({ owner, repo, pull_number }: CommentCountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { data, isLoading } = usePullRequestDetail(owner, repo, pull_number, { isActive: isInView });

  if (isLoading || !data) {
    return null;
  }

  let comments = 0;
  if (data.body?.trim()?.length ?? 0 > 0) {
    comments++;
  }
  comments += data.comments + data.review_comments;
  if (comments === 0) {
    return null;
  }

  return (
    <HStack ref={ref} fontSize="xs" color="fg.subtle" gap={0.5}>
      <IoChatboxOutline />
      {comments}
    </HStack>
  );
}
