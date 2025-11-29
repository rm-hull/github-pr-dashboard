import { RequestError } from "@octokit/request-error";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";
import { useCurrentUser } from "./useCurrentUser";

const RESULTS_PER_PAGE = 100;
const MAX_GITHUB_SEARCH_RESULTS = 1000;

export function usePullRequests(state: string = "open") {
  const { octokit } = useApiClient();
  const { data: user } = useCurrentUser();

  return useInfiniteQuery({
    queryKey: ["pull-requests", state, user?.login],
    queryFn: async ({ pageParam = 1 }) => {
      const q = `user:${user?.login} type:pr ${state === "merged" ? "is:merged" : `state:${state}`}`;
      const resp = await octokit.rest.search.issuesAndPullRequests({
        q,
        per_page: RESULTS_PER_PAGE,
        page: pageParam,
        advanced_search: "true",
      });

      const items = resp.data.items;
      const totalCount = resp.data.total_count;

      const currentFetchedCount = (pageParam - 1) * RESULTS_PER_PAGE + items.length;
      const effectiveTotal = Math.min(totalCount, MAX_GITHUB_SEARCH_RESULTS);

      let nextPageParam: number | undefined = undefined;
      if (items.length === RESULTS_PER_PAGE && currentFetchedCount < effectiveTotal) {
        nextPageParam = pageParam + 1;
      }

      return {
        items,
        totalCount,
        nextPageParam,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
    select: (data) => ({
      ...data,
      pages: data.pages.flatMap((page) => page.items),
    }),
    refetchInterval: (query) => (query.state.dataUpdateCount > 0 && query.state.error ? false : 60000),
    refetchIntervalInBackground: true,
    enabled: !!user,
    retry: (failureCount, error) => {
      if (error instanceof RequestError && error.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
