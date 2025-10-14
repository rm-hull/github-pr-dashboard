import { RestEndpointMethodTypes } from "@octokit/rest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";

type MutationProps = {
  owner: string;
  repo: string;
  pull_number: number;
  merge_method?: RestEndpointMethodTypes["pulls"]["merge"]["parameters"]["merge_method"];
};

export function useMergePullRequest() {
  const qc = useQueryClient();
  const { octokit } = useApiClient();

  return useMutation({
    mutationFn: ({ owner, repo, pull_number, merge_method = "squash" }: MutationProps) =>
      octokit.pulls.merge({ owner, repo, pull_number, merge_method }),
    onSuccess: async (_, variables) => {
      await qc.invalidateQueries({ queryKey: ["open-prs"] });
      await qc.invalidateQueries({ queryKey: ["pr", `${variables.owner}/${variables.repo}`] });
    },
  });
}
