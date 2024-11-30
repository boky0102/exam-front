import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

// LAYOUT OF THE MAIN APPLICATION -> EVERYTHING UNDER THE NAVBAR
function RouteComponent() {
  return (
    <>
      <Outlet></Outlet>
    </>
  );
}
