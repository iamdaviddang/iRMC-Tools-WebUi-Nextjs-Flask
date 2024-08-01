"use client";
import CopyToClipboardButton from "@/components/CopyToClipboardButton";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ConnectToSsh from "@/components/ConnectToSsh";
import {
  areCredentialsStored,
  clearCredentials,
  getCredentials,
  saveCredentials,
} from "@/localStorage/functions";

const storages = [
  {
    pc: "PC01",
    ip: "172.25.63.4",
  },
  {
    pc: "PC02",
    ip: "172.25.63.5",
  },
  {
    pc: "PC03",
    ip: "172.25.63.6",
  },
  {
    pc: "PC04",
    ip: "172.25.63.3",
  },
  {
    pc: "PC05",
    ip: "172.25.63.2",
  },
  {
    pc: "PC06",
    ip: "172.25.63.1",
  },
  {
    pc: "PC07",
    ip: "172.25.246.26",
  },
  {
    pc: "PC08",
    ip: "172.25.246.31",
  },
  {
    pc: "PC09",
    ip: "172.25.212.244",
  },
  {
    pc: "PC10",
    ip: "172.25.246.24",
  },
];

const fileServer = [
  {
    server: "All models",
    ip: "172.25.8.2",
  },
];

const page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="flex">
        <div id="storage-pc" className="w-max h-max flex-col ml-10">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle className="text-primary">Storage PC's</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PC</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storages.map((pcs) => (
                    <TableRow key={pcs.pc}>
                      <TableCell className="font-medium">{pcs.pc}</TableCell>
                      <TableCell className="flex gap-2">{pcs.ip}</TableCell>
                      <TableCell className="text-center text-primary">
                        <CopyToClipboardButton text={pcs.ip} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div id="file-server" className="w-max h-max flex-col ml-10">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle className="text-primary">File Servers</CardTitle>
              {!isLogget ? (
                <CardDescription className="text-red-500">
                  Your Credentials are not saved. Please go to Settings page and
                  save them.
                </CardDescription>
              ) : null}
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  /mnt/M5_LOGS_PROD/ <br /> /mnt/M6_MM5_M1_PROD/ <br />{" "}
                  /mnt/M7_PROD/
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Server</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileServer.map((fileServer) => (
                    <TableRow key={fileServer.server}>
                      <TableCell className="font-medium">
                        {fileServer.server}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {fileServer.ip}
                      </TableCell>
                      <TableCell className="text-center text-primary">
                        <div className="flex gap-3 justify-center">
                          <CopyToClipboardButton text={fileServer.ip} />
                          {isLogget ? (
                            <ConnectToSsh
                              ip={fileServer.ip}
                              nameofserver={fileServer.server}
                            />
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
