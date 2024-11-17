import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Avatar, Button, Navbar } from "flowbite-react";

import DiscordIcon from "../components/icons/Discord";
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../main";

export const Route = createRootRoute<{ queryClient: QueryClient }>({
  component: App,
  notFoundComponent: NotFound,
});

function App() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["userData"],
    refetchOnMount: true,
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

  const { refetch } = useQuery({
    queryKey: ["logout"],
    queryFn: async () => {
      const url = import.meta.env.VITE_BACKEND_URL + "/users/logout";
      const response = await axios.get(url, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: false,
    retry: 0,
  });

  function handleLogOutClick() {
    refetch();
    queryClient.removeQueries({ queryKey: ["userData"] });
  }

  return (
    <div>
      <Navbar fluid rounded>
        <Navbar.Brand
          as={Button}
          href="https://discord.com/oauth2/authorize?client_id=1234546843237748746&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth&scope=identify"
        >
          <span>Login</span>
          <DiscordIcon></DiscordIcon>
        </Navbar.Brand>
        <Navbar.Brand as={Button} onClick={handleLogOutClick}>
          <span>Log out</span>
        </Navbar.Brand>
        <Navbar.Brand>
          <Avatar img={data?.avatar}></Avatar>
        </Navbar.Brand>
      </Navbar>
      <hr />
      <Outlet></Outlet>
      <div className=" w-full border-t-gray-300">Outlet Bound</div>
      <TanStackRouterDevtools />
    </div>
  );
}

function NotFound() {
  return <h1>Sorry, this page does not exist</h1>;
}
