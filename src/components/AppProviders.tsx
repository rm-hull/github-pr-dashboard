import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/utils/queryClient";
import { GithubTokeExpiredDialog } from "./GithubTokenExpiredDialog";
import { Provider as ChakraProvider } from "./ui/provider";
import { Toaster } from "./ui/toaster";

export function AppProviders({ children }: PropsWithChildren) {
  const { isExpired, setExpired } = useAuth();

  useEffect(() => {
    const handler = () => setExpired(true);
    window.addEventListener("auth-token-expired", handler);
    return () => window.removeEventListener("auth-token-expired", handler);
  }, [setExpired]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      <ChakraProvider>
        <Toaster />
        {isExpired && <GithubTokeExpiredDialog />}
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  );
}
