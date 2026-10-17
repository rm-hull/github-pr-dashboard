import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";

export function useCurrentUser() {
  const { octokit, isAuthenticated } = useApiClient();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const resp = await octokit.rest.users.getAuthenticated();
      // TODO: handle status != 200 ?
      return resp.data;
    },
    enabled: isAuthenticated,
  });
}
