import { cn } from "@/lib/utils";
import { InputProps } from "@/types";
import React from "react";

const Input = ({
  type = "text",
  value,
  onChange,
  className,
  placeholder,
  icon,
}: InputProps) => {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute top-[50%] left-3 translate-y-[-50%]">{icon}</span>
      )}
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
    </div>
  );
};

export default Input;
