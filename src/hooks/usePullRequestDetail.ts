import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useApiClient } from "./useApiClient";
import { useCurrentUser } from "./useCurrentUser";

type Options = {
  isActive: boolean;
};

export function usePullRequestDetail(owner: string, repo: string, pull_number: number, options?: Options) {
  const { octokit } = useApiClient();
  const { data: user } = useCurrentUser();
  const [mergeableState, setMergeableState] = useState<string | undefined>();

  return useQuery({
    queryKey: ["pr", `${owner}/${repo}`, pull_number],
    queryFn: async () => {
      const resp = await octokit.rest.pulls.get({ owner, repo, pull_number });
      setMergeableState(resp.data.mergeable_state);
      return resp.data;
    },
    staleTime: mergeableState === "unknown" ? 5000 : 300_000,
    refetchInterval: mergeableState === "unknown" ? 5000 : false,
    enabled: !!user && options?.isActive,
  });
}
