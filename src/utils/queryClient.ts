import { QueryCache, QueryClient } from "@tanstack/react-query";
import { RequestError } from "@octokit/request-error";

function isRequestError(error: unknown): error is RequestError {
  return error instanceof RequestError;
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (isRequestError(error) && error.status === 401) {
        sessionStorage.removeItem("gh_token");
        window.dispatchEvent(new CustomEvent("auth-token-expired"));
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isRequestError(error) && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});
