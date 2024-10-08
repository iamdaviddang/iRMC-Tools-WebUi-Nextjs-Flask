import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Response = ({ message, status, data, unit, onClick }: any) => {
  console.log(data);
  const clear = () => {
    const clickData = { usn: unit };
    onClick(clickData);
    toast("SEL has been successfully cleared.");
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };
    return date.toLocaleDateString("en-US");
  };

  return (
    <div className="w-max">
      <Alert variant={status === "ok" ? "success" : "destructive"}>
        <AlertTitle className="text-xl font-semibold flex items-center gap-1">
          {status === "bad" ? <strong>{unit}</strong> : null}
        </AlertTitle>
        <AlertDescription className="text-xl font-bold flex flex-col">
          {message}
        </AlertDescription>
        {data && data["unit"] ? (
          <div className="flex flex-col gap-2 mt-4 text-xl text-black">
            <Separator />
            <p>
              Data for: <strong>{unit}</strong>
            </p>
            <Separator />
            <p>
              BIOS: <strong>{data["unit"]["BIOS"]}</strong>
            </p>
            {data["unit"]["Recovery-BIOS"] &&
            data["unit"]["Recovery-BIOS"] != "" ? (
              <p className="text-sm">
                Recovery-BIOS: {data["unit"]["Recovery-BIOS"]}
              </p>
            ) : null}
            <Separator />
            <p>
              iRMC: <strong>{data["unit"]["iRMC"]}</strong>
            </p>
            <div className="text-sm">
              <p>
                Low image: {data["unit"]["irmc_low_fw"]} -{" "}
                {data["unit"]["irmc_low_state"]}
              </p>
              <p>
                High image: {data["unit"]["irmc_high_fw"]} -{" "}
                {data["unit"]["irmc_high_state"]}
              </p>

              {data["unit"]["irmc_golden_fw"] &&
              data["unit"]["irmc_golden_fw"] != "" ? (
                <p>
                  Golden image: {data["unit"]["irmc_golden_fw"]} -{" "}
                  {data["unit"]["irmc_golden_state"]}
                </p>
              ) : null}
            </div>
            <Separator />
            <p>
              Model: <strong>{data["unit"]["Model"]}</strong>
            </p>
            <p>
              Power Status:{" "}
              <strong
                style={{
                  color:
                    data["unit"]["Power-Status"] === "On"
                      ? "green"
                      : data["unit"]["Power-Status"] === "Off"
                      ? "red"
                      : "inherit",
                }}
              >
                {data["unit"]["Power-Status"]}
              </strong>
            </p>
            <Separator />
            <p>
              iRMC IP:{" "}
              <a href={`http://${data["unit"]["iRMC-IP"]}`} target="_blank">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <strong>{data["unit"]["iRMC-IP"]}</strong>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open in new card</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </a>
            </p>

            <p>
              iRMC Password: <strong>{data["unit"]["iRMC-Password"]}</strong>
            </p>
          </div>
        ) : null}
        {data && data["sd-card"] ? (
          <div className="flex flex-col gap-2 mt-4 text-xl text-black">
            <Separator />
            <p>
              Data for: <strong>{unit}</strong>
            </p>
            <Separator />
            <p>
              Status:{" "}
              <strong
                style={{
                  color:
                    data["sd-card"]["Status"] === "OK"
                      ? "green"
                      : data["sd-card"]["Status"] !== "OK"
                      ? "red"
                      : "inherit",
                }}
              >
                {data["sd-card"]["Status"]}
              </strong>
            </p>
            <p>
              Inserted:{" "}
              <strong>
                {data["sd-card"]["Inserted"] === true ? "True" : "False"}
              </strong>
            </p>
            <p>
              Mounted:{" "}
              <strong>
                {data["sd-card"]["Mounted"] === true ? "True" : "False"}
              </strong>
            </p>
            <Separator />
            <p>
              Capacity:{" "}
              <strong>
                {data["sd-card"]["CapacityMB"] === null
                  ? "null"
                  : data["sd-card"]["CapacityMB"]}{" "}
              </strong>
            </p>
            <p>
              FreeSpace:{" "}
              <strong>
                {data["sd-card"]["FreeSpaceMB"] === null
                  ? "null"
                  : data["sd-card"]["FreeSpaceMB"]}
              </strong>
            </p>
          </div>
        ) : null}
        {data && data["sel"] ? (
          <div className="flex flex-col gap-2 mt-4 text-xl text-black">
            <Separator />
            <div className="flex justify-between">
              <p>
                Data for: <strong>{unit}</strong>
              </p>
              {data["sel"].length > 0 ? (
                <Button variant="destructive" size="sm" onClick={clear}>
                  Clear SEL
                </Button>
              ) : null}
            </div>
            <Separator />
            {data["sel"].length > 0 ? (
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>DateTime</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Event</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data["sel"].map((item) => (
                    <TableRow key={item.ID}>
                      <TableCell>{formatDateTime(item.DateTime)}</TableCell>
                      <TableCell
                        style={{
                          color:
                            item.Severity === "OK"
                              ? "green"
                              : item.Severity === "Critical"
                              ? "red"
                              : item.Severity === "Warning"
                              ? "orange"
                              : "inherit",
                          fontWeight:
                            item.Severity === "Critical"
                              ? "bold"
                              : item.Severity === "Warning"
                              ? "500"
                              : "normal",
                        }}
                      >
                        {item.Severity}
                      </TableCell>
                      <TableCell>{item.Event}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </div>
        ) : null}
        {data && data["sel"] && data["sel"].length === 0 ? (
          <p className="font-bold text-xl pt-5">SEL is clear!</p>
        ) : null}
        {data && data["BIOS"] ? (
          <div className="text-black text-xl mt-5 flex gap-5 flex-col">
            <Separator />
            <p>For: {unit}</p>
            <Separator />
            <p>
              BIOS: <strong>{data["BIOS"]}</strong>
            </p>
            <p>
              iRMC: <strong>{data["iRMC"]}</strong>
            </p>
          </div>
        ) : null}
        {data && data["sar"] ? (
          <div className="flex flex-col gap-5">
            {data["sar"] ? (
              <p className="text-black text-2xl mt-5">
                SAR last change: <strong>{data["sar"]}</strong>
              </p>
            ) : null}
            {data["sar"] && data["cpn"] ? <Separator /> : null}
            {data["cpn"] ? (
              <p className="text-black text-2xl">
                CPN last change: <strong>{data["cpn"]}</strong>
              </p>
            ) : null}
          </div>
        ) : null}
        {data && data["reset-response"] ? (
          <div className="text-black mt-4">
            <h2 className="text-2xl">Commands used</h2>
            <ul className="flex flex-col gap-3 mt-2">
              {Object.entries(data["reset-response"]).map(
                ([key, value]: any) => (
                  <li key={key}>
                    <div className="flex flex-col">
                      <strong>{key}</strong>
                      <p
                        className={
                          value === 0
                            ? "text-green-500 font-bold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        Return code: {value}
                      </p>
                      <Separator />
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        ) : null}
      </Alert>
    </div>
  );
};
