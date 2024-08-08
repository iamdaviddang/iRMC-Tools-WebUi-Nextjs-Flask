"use client";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Response } from "@/components/response";
import MyLoading from "@/components/my-loading";
import { MdOutlineRestartAlt } from "react-icons/md";
import { FaInfo } from "react-icons/fa";
import { FaSdCard } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import { toast } from "sonner";
import { getFwApi } from "@/actions/API_requests";

const page = () => {
  const [userInput, setUserInput] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [unit, setUnit] = useState("");
  const [unitData, setUnitData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const clearValues = () => {
    setUnitData(null);
    setMessage("");
    setStatus("");
    setUnitData("");
    setUserInput("");
    setShowResponse(false);
    setUnit("");
  };

  const searchFwButtonClick = async () => {
    setShowResponse(false);
    if (userInput.trim() === "") {
      toast("ERROR - You have to enter some model!");
      setShowResponse(false);
    } else {
      setLoading(true);
      const data = await getFwApi(userInput);
      setLoading(false);
      if (data) {
        setUnitData(null);
        setMessage(data["message"]);
        setStatus(data["status"]);
        setUnitData(data["data"]);
        setUnit(data["request-for"]);
        setUserInput("");
        setShowResponse(true);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center gap-10 mt-8">
      <div className="flex justify-center ">
        <Tabs defaultValue="Search for FW" className="w-[90%]">
          {/* <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="Search for FW" className="gap-1">
              <FaMagnifyingGlass className="h-4 w-4 text-primary" />
              BIOS/iRMC FW
            </TabsTrigger>
          </TabsList> */}
          <TabsContent value="Search for FW" className="gap-1">
            <Card>
              <CardHeader>
                <CardTitle>Search for FW</CardTitle>
                <CardDescription>
                  This tool will help you find the current production FW for
                  BIOS and iRMC
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="Search for FW">Model</Label>
                  <Input
                    required
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="for example RX2540M7"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-5">
                <Button onClick={searchFwButtonClick}>Send request</Button>
                {loading ? <MyLoading /> : null}
                {showResponse ? (
                  <div className="flex flex-col justify-center items-center">
                    <Response
                      message={message}
                      status={status}
                      data={unitData}
                      unit={unit}
                    />
                  </div>
                ) : null}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default page;
