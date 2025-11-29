import { createFileRoute } from "@tanstack/react-router";
import { PullRequestPage } from "@/pages/PullRequestPage";

export const Route = createFileRoute("/github-pr-dashboard/history")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PullRequestPage prState="merged" listState="closed" />;
}
