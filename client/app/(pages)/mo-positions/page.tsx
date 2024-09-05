"use client";
import { useState } from "react";

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
import MyLoading from "@/components/my-loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GiPositionMarker } from "react-icons/gi";

const FormSchema = z.object({
  mo: z
    .string()
    .regex(/^\d+$/, {
      message: "MO must contain only numbers.",
    })
    .min(12, {
      message: "MO must be at least 12 numbers.",
    })
    .max(12, {
      message: "MO must be at most 12 numbers.",
    }),
});

export default function Home() {
  const [mo, setMo] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mo: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `http://10.82.66.179:5050/api/web-tools/mo-positions?mo=${data.mo}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.text();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-5">
      <section>
        <Card className="w-max">
          <CardHeader>
            <CardTitle className="flex gap-2">
              <GiPositionMarker className="h-4 w-4 text-primary" />
              MO -&gt; Positions
            </CardTitle>
            <CardDescription>
              This tool can help you to find all positions of scanned units in
              monitor for your MO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-2/3 space-y-6 flex items-center gap-4"
                >
                  <FormField
                    control={form.control}
                    name="mo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MO</FormLabel>
                        <FormControl>
                          <Input placeholder="000044379910" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </div>
          </CardContent>
          <CardFooter className="w-full">
            <div className="flex flex-col justify-center items-center w-full">
              {loading && <MyLoading />}
              {error && <p style={{ color: "red" }}>{error}</p>}
              {data && <pre className="text-xl">{data}</pre>}
            </div>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
