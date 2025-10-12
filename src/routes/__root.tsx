import { CatchBoundary, Outlet, createRootRoute } from "@tanstack/react-router";
import { Backdrop } from "@/components/Backdrop";
import { ErrorFallback } from "@/components/ErrorFallback";
import { NavBar } from "@/components/NavBar";

export const Route = createRootRoute({
  component: () => {
    return (
      <CatchBoundary getResetKey={() => "reset"} errorComponent={ErrorFallback}>
        <NavBar />
        <Backdrop />
        <Outlet />
      </CatchBoundary>
    );
  },
});
