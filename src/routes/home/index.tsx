import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "flowbite-react";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Sidebar className="h-[calc(100vh-5rem)]">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item>My Exams</Sidebar.Item>
          <Sidebar.Item>Start Exam</Sidebar.Item>
          <Sidebar.Item>Add Question</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
