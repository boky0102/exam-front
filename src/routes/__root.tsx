import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Avatar, Button, Navbar } from "flowbite-react";

import DiscordIcon from "../components/icons/Discord";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

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
    <div className=" h-20">
      <Navbar fluid rounded>
        {!data?.username && (
          <Navbar.Brand
            as={Button}
            href="https://discord.com/oauth2/authorize?client_id=1234546843237748746&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth&scope=identify"
          >
            <span>Login</span>
            <DiscordIcon></DiscordIcon>
          </Navbar.Brand>
        )}

        <Navbar.Brand as={Button} onClick={() => mutate()}>
          <span>Log out</span>
        </Navbar.Brand>
        <Navbar.Brand>
          <Avatar img={data?.avatar}></Avatar>
        </Navbar.Brand>
      </Navbar>
      <hr />
      <Outlet></Outlet>
      <TanStackRouterDevtools />
    </div>
  );
}

function NotFound() {
  return <h1>Sorry, this page does not exist</h1>;
}
