import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import { useCurrentUser } from "./useCurrentUser";

export function useOpenPullRequests() {
  const { octokit } = useApiClient();
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: ["open-prs", user?.login],
    queryFn: async () => {
      const q = `user:${user?.login} type:pr state:open`;
      const resp = await octokit.rest.search.issuesAndPullRequests({ q, per_page: 100 });
      return resp.data.items;
    },
    enabled: !!user,
  });
}
