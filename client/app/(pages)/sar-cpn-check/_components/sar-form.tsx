"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { models } from "@/app/(pages)/sar-cpn-check/data";
import { Response } from "@/components/response";
import MyLoading from "@/components/my-loading";

const FormSchema = z.object({
  mo_number: z
    .string()
    .refine((val) => /^\d+$/.test(val), {
      message: "The value must be a number",
    })
    .refine((val) => val.length === 12, {
      message: "The length of the number must be exactly 12 digits",
    })
    .transform((val) => Number(val)),
  model: z.string({
    required_error: "Please select a language.",
  }),
});

export function SarForm() {
  const [open, setOpen] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [unit, setUnit] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mo_number: null,
      model: null,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setShowResponse(false);
    setShowErrorMessage(false);
    setLoading(true);
    const userData = {
      mo: data.mo_number,
      model: data.model,
    };
    const url = "http://10.82.66.179:5050/api/web-tools/sar-flow/";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      setLoading(false);
      if (data) {
        setData(data["data"]);
        setShowResponse(true);
        setMessage(data["message"]);
        setStatus(data["status"]);
      }
    } catch (error) {
      setShowResponse(false);
      setLoading(false);
      setShowErrorMessage(true);
    }
  }

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="mo_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MO</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0000568794"
                    {...field}
                    className="w-max"
                  />
                </FormControl>
                <FormDescription>
                  Enter the MO for which you want to find the last change.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Model</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? models.find((model) => model.value === field.value)
                              ?.label
                          : "Select model"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-primary" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search model..." />
                      <CommandList>
                        <CommandEmpty>No model found.</CommandEmpty>
                        <CommandGroup>
                          {models.map((model) => (
                            <CommandItem
                              value={model.label}
                              key={model.value}
                              onSelect={() => {
                                form.setValue("model", model.value);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 text-primary",
                                  model.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {model.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <div id="response" className="flex flex-col justify-center w-full h-max">
        {loading ? (
          <div className="mx-auto">
            <MyLoading />
          </div>
        ) : null}
        {showResponse ? (
          <div className="flex flex-col justify-center items-center mt-5">
            <Response message={message} status={status} data={data} />
          </div>
        ) : null}
        {showErrorMessage ? (
          <h2 className="font-bold text-red-500 w-full text-center text-xl mt-5">
            Failed to fetch data. Please contact TT David.
          </h2>
        ) : null}
      </div>
    </div>
  );
}
