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

export const Response = ({ message, status, data, unit, onClick }) => {
  const clear = () => {
    const clickData = { usn: unit };
    onClick(clickData);
    toast("SEL has been successfully cleared.");
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      // weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="w-max">
      <Alert variant={status === "ok" ? "success" : "destructive"}>
        <AlertTitle className="text-xl font-semibold flex items-center gap-1">
          {/* {status === "bad" ? <MdError alt="error" /> : <MdDone alt="done" />}
          Status: {status} */}
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
            <p>
              iRMC: <strong>{data["unit"]["iRMC"]}</strong>
            </p>
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
              iRMC IP: <strong>{data["unit"]["iRMC-IP"]}</strong>
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
              Status: <strong>{data["sd-card"]["Status"]}</strong>
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
                    {/* <th>ID</th> */}
                    <TableHead>DateTime</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Event</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data["sel"].map((item) => (
                    <TableRow key={item.ID}>
                      {/* <td>{item.ID}</td> */}
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
                              : "inherit", // Pokud není žádná z uvedených podmínek splněna, použije se výchozí barva
                          fontWeight:
                            item.Severity === "Critical"
                              ? "bold"
                              : item.Severity === "Warning"
                              ? "500" // Semibold
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
            ) : // <p>No data available</p>
            null}
          </div>
        ) : null}
        {data && data["sel"] && data["sel"].length === 0 ? (
          <p className="font-bold text-xl pt-5">SEL is clear!</p>
        ) : null}
      </Alert>
    </div>
  );
};
