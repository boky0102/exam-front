import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Command } from "@/components/ui/command";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";

import { useEffect, useState } from "react";
import { Search, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export const Route = createFileRoute("/home/add-question/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [subject, setSubject] = useState({} as Subject);

  const { data, isLoading, error } = useQuery({
    queryKey: ["subjects", subject],
    refetchOnMount: false,
    retry: 0,
    queryFn: async (): Promise<[Subject]> => {
      const url =
        import.meta.env.VITE_BACKEND_URL + `/subject?query=${subject.name}`;
      const response = await axios.get(url, {
        withCredentials: true,
      });

      return response.data;
    },
  });

  function handleSubjectChange(search: string) {
    setSubject({
      name: search,
    });
  }

  function handleCreateButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log("CLICKED");
    const url = import.meta.env.VITE_BACKEND_URL + "/subject";
    axios
      .post(
        url,
        { subject: subject.name },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        console.log("CREATED");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    console.log(data);
  }, [data]);

  // add time limit on how fast it can fetch depending on keyboar speed
  return (
    <Card className="mx-auto mt-5 w-4/6">
      <CardHeader>
        <CardTitle className=" flex items-center justify-between">
          <h1>SUBJECT</h1>
          <TriangleAlert className=" text-amber-600"></TriangleAlert>
        </CardTitle>
        <CardDescription>Find or create subject</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <Command className=" mt-5">
          <div className="flex items-center justify-between">
            <CommandInput
              placeholder="Type the name of the subject"
              className="max-w-xl grow border-0 border-b border-input bg-transparent p-3 focus-visible:border-primary focus-visible:outline-none"
              onValueChange={handleSubjectChange}
              autoFocus
            ></CommandInput>
            <Search className="mx-4 text-muted-foreground"></Search>
          </div>

          <CommandList>
            <CommandEmpty className=" p-5">
              <div className="flex items-center justify-between">
                <h1>Please create subject</h1>
                <Button onClick={handleCreateButtonClick}>CREATE</Button>
              </div>
            </CommandEmpty>
            <CommandGroup className=" p-3">
              <CommandItem className=" my-2">Math</CommandItem>
              <CommandItem className=" my-2">Science</CommandItem>
              <CommandItem className=" my-2">EELS</CommandItem>
              {data?.map((subject) => (
                <CommandItem className=" my-2">{subject.name}</CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CardContent>
      <Separator />
      <CardFooter>
        <p className="mt-5 text-sm text-muted-foreground">
          Please don't make new subject with similar name if it already exists.
          This is a mandatory step in adding a question. If you have problems
          with proceding please make sure you have created a subject or selected
          existing one.
        </p>
      </CardFooter>
    </Card>
  );
}
