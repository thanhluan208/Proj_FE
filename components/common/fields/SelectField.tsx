"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CommonOption } from "@/types";
import { motion } from "framer-motion";
import React, { ReactNode, useCallback } from "react";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from "react-hook-form";

interface SelectFieldProps<
  FormValues extends FieldValues,
  TName extends Path<FormValues>
> {
  control: Control<FormValues, any>;
  name: TName;
  label?: ReactNode;

  description?: string;
  placeholder?: string;
  options: CommonOption[];

  onChangeCustomize?: (value: string) => void;
  afterOnChange?: (value: string) => void;

  handleLoadmore?: () => void;
  isFetchingMore?: boolean;
  isLoading?: boolean;

  disabled?: boolean;
  required?: boolean;

  leftIcon?: ReactNode;
  triggerClassName?: string;
}

const SelectField = <
  FormValues extends FieldValues,
  TName extends Path<FormValues>
>({
  control,
  name,
  label,
  description,
  placeholder,
  options,
  onChangeCustomize,
  afterOnChange,
  handleLoadmore,
  isFetchingMore,
  isLoading,
  disabled,
  required,
  leftIcon,
  triggerClassName,
}: SelectFieldProps<FormValues, TName>) => {
  const form = useFormContext<FormValues>();
  const id = React.useId();

  const handleChange = useCallback(
    (value: string) => {
      if (options?.every((opt) => opt.value !== value)) return;

      if (onChangeCustomize) {
        onChangeCustomize(value);
        return;
      }

      form.setValue(name, value as PathValue<FormValues, TName>, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (afterOnChange) {
        afterOnChange(value);
      }
    },
    [form, name, onChangeCustomize, afterOnChange, options]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem id={id}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={handleChange}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "border-border transition-colors duration-200 w-full",
                  "hover:border-primary focus:border-primary",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "rounded-[10px]",
                  leftIcon && "pl-2",
                  triggerClassName
                )}
              >
                <div className="flex items-center gap-1.5 w-full">
                  {leftIcon}
                  <SelectValue placeholder={placeholder} />
                </div>
              </SelectTrigger>
            </FormControl>
            <SelectContent className="relative z-10000 max-h-[300px] border-border overflow-y-auto">
              {isLoading && (
                <div className="py-2 px-2 text-sm text-muted-foreground">
                  Loading...
                </div>
              )}
              {!isLoading && options?.length === 0 && (
                <div className="py-2 px-2 text-sm text-muted-foreground">
                  No data found
                </div>
              )}
              {options?.map((opt) => (
                <SelectItem
                  className={cn(
                    "hover:bg-[#E7F6F1] focus:bg-[#E7F6F1]",
                    opt.value === field.value && "bg-[#E7F6F1]"
                  )}
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </SelectItem>
              ))}
              {handleLoadmore && (
                <motion.div
                  onViewportEnter={() => {
                    if (!isFetchingMore) {
                      handleLoadmore();
                    }
                  }}
                />
              )}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectField;
