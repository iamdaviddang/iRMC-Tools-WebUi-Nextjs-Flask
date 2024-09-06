"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { clearCredentials } from "@/localStorage/functions";
import { FaHistory } from "react-icons/fa";
import { toast } from "sonner";

function Page() {
  const [isLogged, setIsLogget] = useState(false);

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
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="/settings" className="font-semibold text-primary">
            SSH Credentials
          </Link>
        </nav>
        <div className="grid gap-6">
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>Credentials for SSH connection</CardTitle>
              {!isLogged ? (
                <CardDescription>
                  Save your credentials to be able connect to file server via
                  SSH
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
                      placeholder=""
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">PASSWORD</Label>
                    <Input
                      id="password"
                      placeholder=""
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex gap-3">
              <Button onClick={handleSave}>Save</Button>
              {isLogged ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearCredentials}
                >
                  Delete current credentials
                </Button>
              ) : null}
            </CardFooter>
          </Card>
          {isLogged && username === "davidd" ? (
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Admin card</CardTitle>
                <CardDescription>Card only for admin</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/fru-updater"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  prefetch={false}
                >
                  <FaHistory className="h-4 w-4" />
                  <span className="text-xl">FRU Updater</span>
                </Link>
              </CardContent>
              <CardFooter className="flex justify-between"></CardFooter>
            </Card>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default Page;
