import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import { useCurrentUser } from "./useCurrentUser";

export function useOrgs() {
  const { octokit, isAuthenticated } = useApiClient();
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: ["orgs", user?.login],
    queryFn: async () => {
      const resp = await octokit.rest.orgs.listForAuthenticatedUser({
        per_page: 100,
      });
      return resp.data;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
