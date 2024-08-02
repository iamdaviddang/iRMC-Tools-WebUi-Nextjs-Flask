"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  areCredentialsStored,
  clearCredentials,
} from "@/localStorage/functions";

const Page = () => {
  const [isLogget, setIsLogget] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setIsLogget(true);
    } else {
      setIsLogget(false);
    }
  }, []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    if (username && password) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      toast("Přihlašovací údaje byly uloženy.");
    } else {
      toast("Vyplňte prosím všechny údaje.");
    }
  };

  return (
    <div className="m-10">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Credentials for SSH</CardTitle>
          {!isLogget ? (
            <CardDescription>
              Save your credentials to be able connect to file server via SSH
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">USERNAME</Label>
                <Input
                  id="username"
                  placeholder="boriso"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">PASSWORD</Label>
                <Input
                  id="password"
                  placeholder="******"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSave}>Save</Button>
          {isLogget ? (
            <Button variant="destructive" size="sm" onClick={clearCredentials}>
              Delete current credentials
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
