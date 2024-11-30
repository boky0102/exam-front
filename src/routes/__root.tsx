import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import DiscordIcon from "../components/icons/Discord";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import MainSidebar from "@/components/main-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Route = createRootRoute<{ queryClient: QueryClient }>({
  component: App,
  notFoundComponent: NotFound,
});

function App() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isSuccess } = useQuery({
    queryKey: ["userData"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async (): Promise<User> => {
      const url = import.meta.env.VITE_BACKEND_URL + "/users/userdata";
      const response = await axios.get(url, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  if (isSuccess) {
    navigate({ to: "/home" });
  }

  const { mutate } = useMutation({
    mutationFn: async () => {
      const url = import.meta.env.VITE_BACKEND_URL + "/users/logout";
      const response = await axios.get(url, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["userData"] });
      navigate({ to: "/" });
    },
  });

  return (
    <SidebarProvider>
      {data && <MainSidebar></MainSidebar>}

      <main className="w-full">
        <nav className="flex flex-row items-center justify-between px-7 sm:h-16 md:h-20 ">
          <h4 className="scroll-m-20 text-xl font-extrabold tracking-tight">
            Exam
          </h4>
          <div className="flex items-center justify-center gap-2">
            {!data && (
              <a href="https://discord.com/oauth2/authorize?client_id=1234546843237748746&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth&scope=identify">
                <Button>
                  LOG IN <DiscordIcon></DiscordIcon>
                </Button>
              </a>
            )}
            <ModeToggle></ModeToggle>
            {data && (
              <Button variant={"default"} onClick={() => mutate()}>
                LOG OUT
              </Button>
            )}
            <Button>BLA</Button>
            <Avatar>
              <AvatarImage
                className="h-10 w-10 rounded-full"
                src={data?.avatar}
              ></AvatarImage>
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
        </nav>
        <hr />
        <Outlet></Outlet>
      </main>

      <TanStackRouterDevtools />
    </SidebarProvider>
  );
}

function NotFound() {
  return <h1>Sorry, this page does not exist</h1>;
}
