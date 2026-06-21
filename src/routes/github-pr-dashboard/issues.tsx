import { createFileRoute } from "@tanstack/react-router";

import { IssuesPage } from "@/pages/IssuesPage";

export const Route = createFileRoute("/github-pr-dashboard/issues")({
  component: RouteComponent,
});

function RouteComponent() {
  return <IssuesPage issueState="open" listState="open" />;
}
