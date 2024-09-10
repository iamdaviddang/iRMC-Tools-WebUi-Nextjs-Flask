"use client";
import { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { AddOwner } from "./add-owner";
import { IoMdPersonAdd } from "react-icons/io";

const FormSchema = z.object({
  newOwner: z.string(),
});

interface UnitData {
  [key: string]: string;
}

interface ApiResponse {
  data: UnitData;
  status: string;
}

const OwnerTable = () => {
  const [unitsData, setUnitsData] = useState<UnitData | null>(null);
  const [oldOwner, setOldOwner] = useState("");
  const [usn, setUsn] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://172.25.32.4/api/v2/monitor/get-units-owners"
        );
        const data: ApiResponse = await response.json();
        setUnitsData(data.data);
      } catch (error) {
        toast("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  interface RemoveUnitOwnerRequest {
    usn: string;
  }

  const removeUnitOwner = async (usn) => {
    try {
      const response = await fetch(
        "http://172.25.32.4/api/v2/monitor/remove-unit-owner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usn }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not delete owner");
      }

      toast("owner deleted");
      location.reload();
    } catch (error) {
      toast("Delete failed:", error);
    }
  };

  const addUnitOwner = async (usn, owner) => {
    try {
      const response = await fetch(
        "http://172.25.32.4/api/v2/monitor/add-unit-owner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usn: usn, user: owner }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not add owner");
      }

      toast("add deleted");
      location.reload();
    } catch (error) {
      toast("add failed:", error);
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newOwner: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data, oldOwner);
    removeUnitOwner(usn);
    addUnitOwner(usn, data.newOwner);
  }

  return (
    <div className="w-[50%] mx-auto mt-10">
      <Dialog>
        <DialogTrigger className="bg-primary px-2 text-gray-100 rounded-2xl flex justify-center items-center">
          <IoMdPersonAdd className="h-4 w-4 mr-2" />
          Add owner
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new owner</DialogTitle>
            <DialogDescription>
              <AddOwner />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {unitsData && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unit</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(unitsData).map(([unit, owner]) => (
              <TableRow key={unit}>
                <TableCell className="font-bold">{unit}</TableCell>
                <TableCell>{owner}</TableCell>
                <TableCell className="flex gap-3">
                  <Dialog>
                    <DialogTrigger>
                      <MdEdit
                        className="w-4 h-4"
                        onClick={() => {
                          setOldOwner(owner);
                          setUsn(unit);
                        }}
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change owner</DialogTitle>
                        <DialogDescription>
                          <div className="flex flex-col gap-3">
                            <h2 className="font-semibold mt-3">
                              Current Owner
                            </h2>
                            <Input
                              placeHolder={oldOwner}
                              disabled
                              className="w-2/3"
                            />
                            <Form {...form}>
                              <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="w-2/3 space-y-6"
                              >
                                <FormField
                                  control={form.control}
                                  name="newOwner"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>New Owner</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Pepik" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit">Submit</Button>
                              </form>
                            </Form>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <MdDelete
                    className="w-4 h-4 text-red-500 cursor-pointer"
                    onClick={() => removeUnitOwner(unit)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default OwnerTable;
