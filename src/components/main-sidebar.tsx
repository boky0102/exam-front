import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenuButton,
} from "./ui/sidebar";

export default function MainSidebar() {
  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarMenuButton>Add Exam</SidebarMenuButton>
      </SidebarContent>
    </Sidebar>
  );
}
