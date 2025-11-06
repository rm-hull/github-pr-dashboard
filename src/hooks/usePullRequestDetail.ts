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
  const [maxAge, setMaxAge] = useState<number | undefined>();

  return useQuery({
    queryKey: ["pr", `${owner}/${repo}`, pull_number],
    queryFn: async () => {
      const resp = await octokit.rest.pulls.get({ owner, repo, pull_number });

      const cacheControl = resp.headers["cache-control"];
      const maxAgeMatch = cacheControl?.match(/max-age=(\d+)/);
      const maxAge = parseInt(maxAgeMatch?.[1] ?? "0", 10) * 1000; // ms

      setMaxAge(resp.data.mergeable_state !== "clean" ? maxAge : undefined);
      return resp.data;
    },
    staleTime: maxAge,
    refetchInterval: maxAge,
    refetchIntervalInBackground: true,
    enabled: !!user && options?.isActive,
  });
}
