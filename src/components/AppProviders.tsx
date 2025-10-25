import { RequestError } from "@octokit/request-error";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";
import { useAuth } from "@/hooks/useAuth";
import { GithubTokeExpiredDialog } from "./GithubTokenExpiredDialog";
import { Provider as ChakraProvider } from "./ui/provider";
import { Toaster } from "./ui/toaster";

function isRequestError(error: unknown): error is RequestError {
  return error instanceof RequestError;
}

export function AppProviders({ children }: PropsWithChildren) {
  const { isExpired, setExpired } = useAuth();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error: unknown) => {
        if (isRequestError(error) && error.status === 401) {
          sessionStorage.removeItem("gh_token");
          setExpired(true);
        }
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <ChakraProvider>
        <Toaster />
        {isExpired && <GithubTokeExpiredDialog />}
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
}
