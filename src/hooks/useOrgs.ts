import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import { useCurrentUser } from "./useCurrentUser";

export function useOrgs() {
  const { octokit, isAuthenticated } = useApiClient();
  const currentUser = useCurrentUser();
  const user = currentUser.data;

  const query = useQuery({
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

  return {
    ...query,
    error: currentUser.error || query.error,
    isError: currentUser.isError || query.isError,
  };
}
