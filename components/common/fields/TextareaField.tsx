"use client";

import React, { ReactNode } from "react";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface TextareaFieldProps<
  FormValues extends FieldValues,
  TName extends Path<FormValues>
> extends Omit<React.ComponentProps<"textarea">, "onChange"> {
  // Core form integration props
  control: Control<FormValues, any>;
  name: TName;
  label: string;

  // Custom change handlers for flexibility
  onChangeCustomize?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  afterOnChange?: (value: string) => void;

  // Icon support for enhanced UI
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  // Container styling customization
  textareaContainerClassName?: string;

  // Show character count indicator
  showCharacterCount?: boolean;
}

const TextareaField = <
  FormValues extends FieldValues,
  TName extends Path<FormValues>
>({
  control,
  name,
  label,
  onChangeCustomize,
  afterOnChange,
  leftIcon,
  rightIcon,
  textareaContainerClassName,
  showCharacterCount = true,
  maxLength,
  className,
  ...otherTextareaProps
}: TextareaFieldProps<FormValues, TName>) => {
  // Get form context to access form methods
  const form = useFormContext<FormValues>();

  // Handle textarea value changes with custom logic support
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // If custom change handler is provided, use it instead of default
    if (onChangeCustomize) {
      onChangeCustomize(e);
      return;
    }

    // Update form field value using react-hook-form setValue
    form.setValue(name, e.target.value as PathValue<FormValues, TName>);

    // Execute additional logic after value change if provided
    if (afterOnChange) {
      afterOnChange(e.target.value);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { onChange, value, ...otherFieldProps } = field;

        return (
          <FormItem className="flex flex-col gap-1">
            {/* Render label if provided */}
            {label && <FormLabel>{label}</FormLabel>}

            <FormControl>
              <div
                className={cn(
                  "relative flex gap-1.5 overflow-hidden",
                  "border border-border transition-colors duration-200",
                  "hover:border-primary focus-within:border-primary",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "rounded-[10px]",
                  leftIcon && "pl-2",
                  rightIcon && "pr-2",
                  textareaContainerClassName
                )}
              >
                {leftIcon && <div className="pt-3 shrink-0">{leftIcon}</div>}

                <div className="relative flex-1">
                  <Textarea
                    onChange={handleChange}
                    value={value || ""}
                    maxLength={maxLength}
                    className={cn(
                      "border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                      "resize-none font-poppins",
                      maxLength && showCharacterCount && "pr-16",
                      className
                    )}
                    {...otherTextareaProps}
                    {...otherFieldProps}
                  />

                  {maxLength && showCharacterCount && (
                    <div className="absolute right-1.5 bottom-1.5 text-sm text-muted-foreground bg-transparent px-1 rounded">
                      {`${(value || "").length}/${maxLength}`}
                    </div>
                  )}
                </div>

                {rightIcon && <div className="pt-3 shrink-0">{rightIcon}</div>}
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default TextareaField;
