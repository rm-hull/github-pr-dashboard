import { ErrorFallback } from "@rm-hull/chakra-error-fallback";
import { CatchBoundary, Outlet, createRootRoute } from "@tanstack/react-router";
import { Backdrop } from "@/components/Backdrop";
import { NavBar } from "@/components/NavBar";

export const Route = createRootRoute({
  component: () => {
    return (
      <CatchBoundary getResetKey={() => "reset"} errorComponent={ErrorFallback}>
        <Backdrop />
        <NavBar />
        <Outlet />
      </CatchBoundary>
    );
  },
});
