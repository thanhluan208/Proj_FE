import React, { ComponentPropsWithoutRef } from "react";

import { CommonOption } from "@/types";
import { SelectProps } from "@radix-ui/react-select";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "@/lib/utils";

interface CommonSelectProps extends ComponentPropsWithoutRef<"select"> {
  options: CommonOption[];
  value: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  contentClassname?: string;
}

const CommonSelect = ({
  options,
  value,
  onValueChange,
  placeholder,
  className,
  contentClassname,
}: CommonSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn("border-neutral-90 cursor-pointer", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn(contentClassname)}>
        {options.map((opt) => {
          return (
            <SelectItem
              className={cn(
                "hover:bg-[#E7F6F1] cursor-pointer",
                opt.value === value && "bg-[#E7F6F1]"
              )}
              value={opt.value}
              key={opt.value}
            >
              {opt.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default CommonSelect;
