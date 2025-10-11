import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ChakraProvider } from "./components/ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import { Toaster } from "./components/ui/toaster";
import { ErrorFallback } from "./components/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <ChakraProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Toaster />
          <App />
        </ErrorBoundary>
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>
);
