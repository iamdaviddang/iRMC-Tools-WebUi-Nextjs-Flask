"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

const generations = [
  {
    value: "M7",
    label: "M7",
  },
  {
    value: "MM6",
    label: "MM6",
  },
  {
    value: "M2",
    label: "M2",
  },
  {
    value: "M6",
    label: "M6",
  },
  {
    value: "MM5",
    label: "MM5",
  },
  {
    value: "M1",
    label: "M1",
  },
];

export function GenComboBox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? generations.find((generation) => generation.value === value)
                ?.label
            : "Select generations..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search generation..." />
          <CommandList>
            <CommandEmpty>No generation found.</CommandEmpty>
            <CommandGroup>
              {generations.map((generation) => (
                <CommandItem
                  key={generation.value}
                  value={generation.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === generation.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {generation.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
