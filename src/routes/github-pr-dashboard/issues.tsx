import { Container } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/github-pr-dashboard/issues")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Container>TODO: Issues</Container>;
}
