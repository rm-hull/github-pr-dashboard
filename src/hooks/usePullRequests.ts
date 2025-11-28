import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import { useCurrentUser } from "./useCurrentUser";

export type PullRequestState = "open" | "closed" | "merged";

export function usePullRequests(state: PullRequestState = "open") {
  const { octokit } = useApiClient();
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: ["pull-requests", state, user?.login],
    queryFn: async () => {
      const q = `user:${user?.login} type:pr ${state === "merged" ? "is:merged" : `state:${state}`}`;
      const resp = await octokit.rest.search.issuesAndPullRequests({ q, per_page: 100, advanced_search: "true" });
      return resp.data.items;
    },
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    enabled: !!user,
  });
}
