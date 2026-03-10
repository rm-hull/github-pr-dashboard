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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pull-requests", "open"] }),
  });
}
