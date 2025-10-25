import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./components/AppProviders";
import { AuthStatusProvider } from "./components/AuthStatusProvider";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthStatusProvider>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </AuthStatusProvider>
  </StrictMode>
);
