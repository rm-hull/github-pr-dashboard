import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import { useCurrentUser } from "./useCurrentUser";

export function usePullRequestDetail(owner: string, repo: string, pull_number: number, active: boolean) {
  const { octokit } = useApiClient();
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: ["pr", repo, pull_number],
    queryFn: async () => {
      const resp = await octokit.rest.pulls.get({ owner, repo, pull_number });
      return resp.data;
    },
    enabled: !!user && active,
  });
}
