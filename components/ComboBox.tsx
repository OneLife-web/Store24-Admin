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
import { updateData } from "@/types";

export function ComboboxDemo({
  products,
  setId,
  id,
}: {
  products: updateData[];
  setId: (id: string) => void;
  id?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  // Set value based on the productId prop
  React.useEffect(() => {
    if (id) {
      const product = products.find((p) => p._id === id);
      if (product) {
        setValue(product.title);
      } else {
        setValue(""); // Reset if product not found
      }
    }
  }, [id, products]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-[48px] rounded-lg justify-between"
        >
          {value
            ? products.find((framework) => framework?.title === value)?.title
            : "Select product..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] bg-white p-0">
        <Command>
          <CommandInput placeholder="Search product..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {products.map((framework) => (
                <CommandItem
                  key={framework?._id}
                  value={framework?.title}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setId(framework._id!);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework?.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework?.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
