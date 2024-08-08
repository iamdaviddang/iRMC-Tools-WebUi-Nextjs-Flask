"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { toast } from "sonner";
import { reportApi } from "@/actions/API_requests";

const ReportAlert = () => {
  const [userInputSubject, setUserInputSubject] = useState("");
  const [userInputText, setUserInputText] = useState("");
  console.log(userInputSubject);
  const form = useForm({
    defaultValues: {
      subject: "",
      text: "",
    },
  });

  async function onSubmit(data) {
    const request = await reportApi(data);
    if (request) {
      toast(request["message"]);
      form.reset();
    } else {
      toast("Something went wrong!");
    }
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className="bg-red-600 px-2 py-1 rounded-md text-white text-sm shadow-md">
          Report issue
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report an issue</AlertDialogTitle>
            <AlertDialogDescription>
              If you found a bug on the site, write it here:
            </AlertDialogDescription>
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
                        <Input
                          placeholder="Enter your subject"
                          {...field}
                          required
                        />
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
                          rows="5"
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
                <div className="flex gap-2">
                  <AlertDialogAction type="submit">Submit</AlertDialogAction>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </div>
              </form>
            </Form>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReportAlert;
