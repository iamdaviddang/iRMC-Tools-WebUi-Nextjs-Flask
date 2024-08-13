"use client";
import { useForm } from "react-hook-form";
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
import { Card } from "./ui/card";
import { toast } from "sonner";

export function ReportForm() {
  const form = useForm({
    defaultValues: {
      subject: "",
      text: "",
    },
  });

  function onSubmit(data) {
    toast("Message sent");
    console.log(data);
    form.reset();
  }

  return (
    <Card className="p-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your subject" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl className="flex flex-col">
                  <textarea
                    required
                    placeholder="Write your message here"
                    className="border border-gray-200 rounded-xl p-3 w-full"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your message will be sent to the David.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </Card>
  );
}
ReportForm;
