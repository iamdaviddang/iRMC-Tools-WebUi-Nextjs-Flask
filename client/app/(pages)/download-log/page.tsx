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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { Response } from "@/components/response";
import MyLoading from "@/components/my-loading";
import { toast } from "sonner";

const Page = () => {
  const [userInput, setUserInput] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [unit, setUnit] = useState("");
  const [unitData, setUnitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const downloadLogButtonClick = async () => {
    setShowResponse(false);
    if (userInput.trim() === "") {
      toast("ERROR - You have to enter some USN!");
      setShowResponse(false);
    } else {
      setLoading(true);
      try {
        const response = await fetch(
          `http://10.82.66.179:5050/api/web-tools/download-log/${userInput}`
        );
        if (response.status == 200) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          setDownloadLink(url);
        } else {
          setDownloadLink(null);
          const data = await response.json();
          console.log(data);
          setMessage(data["message"]);
          setStatus(data["status"]);
          setShowResponse(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Zde můžete přidat nějakou chybovou hlášku pro uživatele
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-10 mt-8">
      <div className="flex justify-center ">
        <Tabs defaultValue="Search for FW" className="w-[90%]">
          <TabsContent value="Search for FW" className="gap-1">
            <Card>
              <CardHeader>
                <CardTitle>Download temporary LOGs</CardTitle>
                <CardDescription>
                  This tool will help you to download current temporary LOGs
                  from tests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="Search for FW">USN</Label>
                  <Input
                    required
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="for example EWCE007944"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-5">
                <Button onClick={downloadLogButtonClick}>Send request</Button>
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
                {downloadLink && (
                  <div className="mt-10 flex items-center justify-center flex-col gap-4 border p-5 rounded-lg">
                    <a href={downloadLink} download="log.zip">
                      <h2 className="text-2xl">LOG found.</h2>
                    </a>
                    <Button onClick={() => window.open(downloadLink, "_blank")}>
                      Download
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
