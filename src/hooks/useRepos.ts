import { useInfiniteQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import { useCurrentUser } from "./useCurrentUser";

export function useRepos() {
  const { octokit } = useApiClient();
  const { data: user } = useCurrentUser();

  return useInfiniteQuery({
    queryKey: ["repos"],
    queryFn: async ({ pageParam = 1 }) => {
      const resp = await octokit.rest.repos.listForAuthenticatedUser({
        affiliation: "owner,collaborator,organization_member",
        per_page: 100,
        page: pageParam,
      });
      return resp.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: !!user,
  });
}
