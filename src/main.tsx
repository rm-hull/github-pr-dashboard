import * as Sentry from "@sentry/react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot, RootOptions } from "react-dom/client";
import { AppProviders } from "./components/AppProviders";
import { routeTree } from "./routeTree.gen";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN as string,
    release: import.meta.env.VITE_GIT_COMMIT_HASH as string,
    environment: import.meta.env.MODE,
  });
}

const router = createRouter({ routeTree });

const errorHandling: RootOptions = {
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn("Uncaught error", error, errorInfo.componentStack);
  }),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
};

createRoot(document.getElementById("root")!, errorHandling).render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);
