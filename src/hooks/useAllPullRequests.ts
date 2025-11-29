import { RequestError } from "@octokit/request-error";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PullRequest } from "@/utils/types";
import { useApiClient } from "./useApiClient";
import { useCurrentUser } from "./useCurrentUser";

const RESULTS_PER_PAGE = 100;
const MAX_GITHUB_SEARCH_RESULTS = 200;

interface PullRequestsPage {
  items: PullRequest[];
  totalCount: number;
  nextPageParam: number | undefined;
}

export function useAllPullRequests(state: string = "open") {
  const { octokit } = useApiClient();
  const { data: user } = useCurrentUser();

  const { data, fetchNextPage, hasNextPage, isFetching, isError, error, isLoading } = useInfiniteQuery<
    PullRequestsPage,
    Error,
    PullRequest[],
    string[],
    number
  >({
    queryKey: ["all-pull-requests", state, user?.login],
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

      // Determine if there's a next page and if we're within the 1000 results limit
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
    enabled: !!user,
    retry: (failureCount, error) => {
      if (error instanceof RequestError && error.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  const allPullRequests = data?.pages || [];

  return {
    allPullRequests,
    isLoading,
    isError,
    error,
    isFetching,
  };
}
