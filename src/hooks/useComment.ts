import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";

type MutationProps = {
  owner: string;
  repo: string;
  pull_number: number;
  body: string;
};

export function useComment() {
  const qc = useQueryClient();
  const { octokit } = useApiClient();

  return useMutation({
    mutationFn: ({ owner, repo, pull_number, body }: MutationProps) =>
      octokit.issues.createComment({ owner, repo, issue_number: pull_number, body }),
    onSettled: (_, _2, { owner, repo }) =>
      Promise.allSettled([
        qc.invalidateQueries({ queryKey: ["pull-requests", "open"] }),
        qc.invalidateQueries({ queryKey: ["pr", `${owner}/${repo}`] }),
      ]),
    onError: (error) => {
      console.error("Error adding comment:", error);
    },
  });
}
