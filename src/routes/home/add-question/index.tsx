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
import { Search, TriangleAlert, SquareCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export const Route = createFileRoute("/home/add-question/")({
  component: RouteComponent,
});

// UX In this component can be grately imporved by giving users options to select things with arrow keys, complete input
// with tab, select item with enter

// adjust behaviour when adding new subject so it doesnt require reselect
// EDGE CASE IF THERE IS ONE SUBJECT STARTING WITH NAME THE OTHERS CANNOT BE ADDED THAT ARE SHORTER AND HAVE SAME START STRING

function RouteComponent() {
  const [subjectInput, setSubjectInput] = useState("" as string);
  const [choosenSubject, setChoosenSubject] = useState(
    undefined as Subject | undefined,
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["subjects", subjectInput],
    refetchOnMount: false,
    retry: 0,
    staleTime: 10000,
    queryFn: async (): Promise<[Subject]> => {
      console.log(subjectInput.length);
      if (subjectInput.length < 3) {
        throw new Error("Input is too short");
      }
      const url =
        import.meta.env.VITE_BACKEND_URL + `/subject?query=${subjectInput}`;
      const response = await axios.get(url, {
        withCredentials: true,
      });

      return response.data;
    },
  });

  function handleSubjectChange(search: string) {
    setChoosenSubject(undefined);
    setSubjectInput(search);
  }

  function handleCreateButtonClick() {
    const url = import.meta.env.VITE_BACKEND_URL + "/subject";
    axios
      .post(
        url,
        { subject: subjectInput },
        {
          withCredentials: true,
        },
      )
      .then((response) => {
        setChoosenSubject({
          name: subjectInput,
          sid: response.data.sid,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleOptionSelect(value: string) {
    const subject = data?.filter((subject) => subject.name == value)[0];
    if (subject) {
      setChoosenSubject(subject);
    }

    console.log(value);
  }

  function handleGlobalClick() {
    if (choosenSubject) {
      setChoosenSubject(undefined);
    }
  }

  // add time limit on how fast it can fetch depending on keyboar speed
  return (
    <Card
      className={
        !choosenSubject
          ? "mx-auto mt-5 w-4/6"
          : "mx-auto mt-5 w-4/6 hover:cursor-pointer"
      }
      onClick={() => handleGlobalClick()}
    >
      <CardHeader>
        <CardTitle className=" flex items-center justify-between">
          <h1>SUBJECT</h1>
          {choosenSubject ? (
            <SquareCheckBig className="text-green-500"></SquareCheckBig>
          ) : (
            <TriangleAlert className=" text-amber-600"></TriangleAlert>
          )}
        </CardTitle>
        <CardDescription>
          {choosenSubject ? (
            <h1>{choosenSubject.name}</h1>
          ) : (
            <p>Choose subject</p>
          )}
        </CardDescription>
      </CardHeader>
      <Separator />
      {!choosenSubject && (
        <CardContent>
          <Command className=" mt-5 h-72">
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
              <CommandEmpty className=" p-3">
                {subjectInput.length > 3 && error && (
                  <div className="flex items-center justify-between">
                    <h1>No subject found, please create subject</h1>
                    <Button onClick={handleCreateButtonClick}>CREATE</Button>
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup className=" p-3">
                {data &&
                  data?.map((subject) => (
                    <CommandItem
                      className=" my-2 max-w-xl rounded p-2 hover:cursor-pointer hover:bg-muted"
                      key={subject.sid}
                      onSelect={handleOptionSelect}
                    >
                      {subject.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </CardContent>
      )}

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
