import { cn } from "@/lib/utils";
import { InputProps } from "@/types";
import React from "react";

const Input = ({
  type = "text",
  value,
  onChange,
  className,
  placeholder,
}: InputProps) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "rounded-lg h-[48px] block w-full px-4 focus:outline-none text-sm placeholder:font-light",
        className
      )}
    />
  );
};

export default Input;
