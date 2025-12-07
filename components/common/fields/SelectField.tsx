import { ComponentPropsWithoutRef } from "react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

import { cn } from "@/lib/utils";
import { CommonOption } from "@/types";
import { motion } from "framer-motion";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface SelectFieldProps<
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
> extends ComponentPropsWithoutRef<"select"> {
  label?: React.ReactNode;
  field: ControllerRenderProps<TFieldValue, TName>;
  description?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  options: CommonOption[];
  onChangeCustomize?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoadmore?: () => void;
  isFetchingMore?: boolean;
  isLoading?: boolean;
  afterOnChange?: (value?: string) => void;
}

const SelectField = <
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
>({
  label,
  field,
  description,
  placeholder,
  options,
  isFetchingMore,
  isLoading,
  handleLoadmore,
  afterOnChange,
  disabled,
  ...otherProps
}: SelectFieldProps<TFieldValue, TName>) => {
  const handleChange = (value: string) => {
    if (options?.every((opt) => opt.value !== value)) return;
    field.onChange(value);
    if (afterOnChange) {
      afterOnChange(value);
    }
  };

  return (
    <FormItem className="flex flex-col gap-1">
      {label && (
        <FormLabel>
          {label}
          {otherProps.required && (
            <span className="text-sm ml-1 -translate-y-1 text-destructive">
              *
            </span>
          )}
        </FormLabel>
      )}
      <Select onValueChange={handleChange} value={field.value}>
        <FormControl>
          <SelectTrigger className="border-neutral-90" disabled={disabled}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="relative z-10000 max-h-[300px] border-neutral-90 overflow-y-auto">
          {options?.length === 0 && <p>No data found</p>}
          {options?.map((opt) => {
            return (
              <SelectItem
                className={cn(
                  "hover:bg-[#E7F6F1]",
                  opt.value === field.value && "bg-[#E7F6F1]"
                )}
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </SelectItem>
            );
          })}
          <motion.div
            onViewportEnter={() => {
              handleLoadmore && handleLoadmore();
            }}
          />
        </SelectContent>
      </Select>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

export default SelectField;
