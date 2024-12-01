import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenuButton,
  SidebarSeparator,
} from "./ui/sidebar";
import { CirclePlus, NotepadText, NotebookPen, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";
type SidebarProps = {
  name: string;
};

export default function MainSidebar(props: SidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className=" my-5 text-center font-bold">
        {props.name}
      </SidebarHeader>
      <SidebarSeparator></SidebarSeparator>
      <SidebarContent className="px-6 py-3">
        <Link
          to="/home"
          className="[&.active]:text-green-300"
          activeOptions={{ exact: true }}
        >
          <SidebarMenuButton className=" flex flex-row justify-between p-6">
            <h1 className=" font-extrabold">HOME</h1>
            <Home></Home>
          </SidebarMenuButton>
        </Link>
        <Link
          to="/home/solve"
          className="[&.active]:text-green-300"
          activeOptions={{ exact: true }}
        >
          <SidebarMenuButton className=" flex justify-between p-6">
            <h1 className=" font-extrabold">SOLVE EXAM</h1>
            <NotebookPen></NotebookPen>
          </SidebarMenuButton>
        </Link>
        <Link
          to="/home/add-question"
          className="[&.active]:text-green-300"
          activeOptions={{ exact: true }}
        >
          <SidebarMenuButton className=" flex flex-row justify-between p-6">
            <h1 className=" font-extrabold">ADD QUESTION</h1>
            <CirclePlus></CirclePlus>
          </SidebarMenuButton>
        </Link>

        <Link
          to="/home/myexams"
          className="[&.active]:text-green-300"
          activeOptions={{ exact: true }}
        >
          <SidebarMenuButton className=" flex flex-row justify-between p-6">
            <h1 className=" font-extrabold">MY EXAMS</h1>
            <NotepadText></NotepadText>
          </SidebarMenuButton>
        </Link>
      </SidebarContent>
    </Sidebar>
  );
}
