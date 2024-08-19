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
import {
  clearSelApi,
  getInfoApi,
  getSdCardCheckApi,
  powerOffApi,
  rebootApi,
  showSelApi,
} from "../actions/API_requests";
import { Response } from "./response";
import MyLoading from "./my-loading";
import { MdOutlineRestartAlt } from "react-icons/md";
import { FaInfo } from "react-icons/fa";
import { FaSdCard } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import { toast } from "sonner";

function ToolsTabs() {
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

  const rebootButtonClick = async () => {
    setShowResponse(false);
    if (userInput.trim() === "") {
      toast("ERROR - You have to enter some USN or iRMC IP!");
      setShowResponse(false);
    } else {
      setLoading(true);
      const data = await rebootApi(userInput);
      setLoading(false);
      if (data) {
        setUnitData(null);
        setShowResponse(true);
        setMessage(data["message"]);
        setStatus(data["status"]);
        setUnit(data["request-for"]);
        setUserInput("");
      }
    }
  };

  const powerOffButtonClick = async () => {
    setShowResponse(false);
    if (userInput.trim() === "") {
      toast("ERROR - You have to enter some USN or iRMC IP!");
      setShowResponse(false);
    } else {
      setLoading(true);
      const data = await powerOffApi(userInput);
      setLoading(false);
      if (data) {
        setUnitData(null);
        setShowResponse(true);
        setMessage(data["message"]);
        setStatus(data["status"]);
        setUnit(data["request-for"]);
        setUserInput("");
      }
    }
  };

  const clearSELButtonClick = async () => {
    setShowResponse(false);
    if (userInput.trim() === "") {
      toast("ERROR - You have to enter some USN or iRMC IP!");
      setShowResponse(false);
    } else {
      setLoading(true);
      const data = await clearSelApi(userInput);
      setLoading(false);
      if (data) {
        setUnitData(null);
        setShowResponse(true);
        setMessage(data["message"]);
        setStatus(data["status"]);
        setUnit(data["request-for"]);
        setUserInput("");
      }
    }
  };

  const getInfoButtonClick = async () => {
    setShowResponse(false);
    if (userInput.trim() === "") {
      toast("ERROR - You have to enter some USN or iRMC IP!");
      setShowResponse(false);
    } else {
      setLoading(true);
      const data = await getInfoApi(userInput);
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

  const sdCardCheck = async () => {
    setShowResponse(false);
    if (userInput.trim() === "") {
      toast("ERROR - You have to enter some USN or iRMC IP!");
      setShowResponse(false);
    } else {
      setLoading(true);
      const data = await getSdCardCheckApi(userInput);
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

  const showSel = async () => {
    setShowResponse(false);
    if (userInput.trim() === "") {
      toast("ERROR - You have to enter some USN or iRMC IP!");
      setShowResponse(false);
    } else {
      setLoading(true);
      const data = await showSelApi(userInput);
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

  const clearValues = () => {
    setUnitData(null);
    setMessage("");
    setStatus("");
    setUnitData("");
    setUserInput("");
    setShowResponse(false);
    setUnit("");
  };

  const handleClickData = async (clickData) => {
    clearValues();
    setShowResponse(false);
    if (clickData["usn"].trim() === "") {
      toast("ERROR - You have to enter some USN or iRMC IP!");
      setShowResponse(false);
    } else {
      setLoading(true);
      await clearSelApi(clickData["usn"]);
      const data = await showSelApi(clickData["usn"]);
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
        <Tabs defaultValue="Get Info" className="w-[90%]">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger
              onClick={clearValues}
              value="Reboot/PowerON"
              className="gap-1"
            >
              <MdOutlineRestartAlt className="h-4 w-4 text-primary" />
              Reboot/PowerON
            </TabsTrigger>
            <TabsTrigger
              onClick={clearValues}
              value="Get Info"
              className="gap-1"
            >
              <FaInfo className="h-4 w-4 text-primary" />
              Get Info
            </TabsTrigger>
            <TabsTrigger
              onClick={clearValues}
              value="SD Card check"
              className="gap-1"
            >
              <FaSdCard className="h-4 w-4 text-primary" />
              SD Card check
            </TabsTrigger>
            <TabsTrigger
              onClick={clearValues}
              value="Show SEL"
              className="gap-1"
            >
              <FaMagnifyingGlass className="h-4 w-4 text-primary" />
              Show SEL
            </TabsTrigger>
            <TabsTrigger
              onClick={clearValues}
              value="Clear SEL"
              className="gap-1"
            >
              <MdDelete className="h-4 w-4 text-primary" />
              Clear SEL
            </TabsTrigger>
            <TabsTrigger
              onClick={clearValues}
              value="Power Off"
              className="gap-1"
            >
              <FaPowerOff className="h-4 w-4 text-primary" />
              Power Off
            </TabsTrigger>
          </TabsList>
          <TabsContent
            onClick={clearValues}
            value="Reboot/PowerON"
            className="gap-1"
          >
            <Card>
              <CardHeader>
                <CardTitle>Reboot/PowerON</CardTitle>
                <CardDescription>
                  This tool restarts the unit. But if it is switched off it just
                  switches it on.
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
              <CardFooter className="flex-col gap-5">
                <Button onClick={rebootButtonClick}>Send request</Button>
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
          <TabsContent value="Get Info">
            <Card>
              <CardHeader>
                <CardTitle>Get Info</CardTitle>
                <CardDescription>
                  This tool shows you the Model, iRMC IP, iRMC Password, Power
                  Status, BIOS version, iRMC version and UUID
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
              <CardFooter className="flex flex-col gap-5">
                <Button onClick={getInfoButtonClick}>Send request</Button>
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
          <TabsContent value="SD Card check">
            <Card>
              <CardHeader>
                <CardTitle>SD Card check</CardTitle>
                <CardDescription>
                  This tool will show you the SD card data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="Clear SEL">USN / iRMC IP</Label>
                  <Input
                    required
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="EWCD004819 or 172.25.132.27"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-5">
                <Button onClick={sdCardCheck}>Send request</Button>
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
          <TabsContent value="Show SEL">
            <Card>
              <CardHeader>
                <CardTitle>Show SEL</CardTitle>
                <CardDescription>This tool shows SEL</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="Clear SEL">USN / iRMC IP</Label>
                  <Input
                    required
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="EWCD004819 or 172.25.132.27"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-5">
                <Button onClick={showSel}>Send request</Button>
                {loading ? <MyLoading /> : null}
                {showResponse ? (
                  <div className="flex flex-col justify-center items-center">
                    <Response
                      onClick={handleClickData}
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
          <TabsContent value="Clear SEL">
            <Card>
              <CardHeader>
                <CardTitle>Clear SEL</CardTitle>
                <CardDescription>This tool clears SEL</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="Clear SEL">USN / iRMC IP</Label>
                  <Input
                    required
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="EWCD004819 or 172.25.132.27"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-5">
                <Button onClick={clearSELButtonClick}>Send request</Button>
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
          <TabsContent value="Power Off">
            <Card>
              <CardHeader>
                <CardTitle>Power Off</CardTitle>
                <CardDescription>
                  This tool checks the power status and Power Off the unit
                  accordingly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="Power Off">USN / iRMC IP</Label>
                  <Input
                    required
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="EWCD004819 or 172.25.132.27"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-5">
                <Button onClick={powerOffButtonClick}>Send request</Button>
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
}

export default ToolsTabs;
