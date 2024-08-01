"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const FruUpdater = () => {
  const [userInput, setUserInput] = useState("");
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>FRU Updater</CardTitle>
        <CardDescription>
          This tool can help you to update MB FRU
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="Reboot/PowerON">USN / iRMC IP</Label>
          <Input
            required
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="EWCD004819 or 172.25.132.27"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Send request</Button>
      </CardFooter>
    </Card>
  );
};

export default FruUpdater;
