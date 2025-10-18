import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ChakraProvider } from "./components/ui/provider";
import { Toaster } from "./components/ui/toaster";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <ChakraProvider>
        <Toaster />
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>
);
