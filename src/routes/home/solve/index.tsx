import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/home/solve/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Input></Input>;
}
