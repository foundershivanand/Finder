import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/startup/$slug")({
  component: StartupRedirect,
});

function StartupRedirect() {
  const { slug } = Route.useParams();
  return <Navigate to="/hit/$kind/$id" params={{ kind: "trustmrr", id: slug }} replace />;
}
