"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { ReactNode, useCallback, useState } from "react";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from "react-hook-form";

interface InputFieldProps<
  FormValues extends FieldValues,
  TName extends Path<FormValues>
> extends InputProps {
  control: Control<FormValues, any>;
  name: TName;
  label: string;

  onChangeCustomize?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  afterOnChange?: (value: string) => void;

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  inputContainerClassName?: string;
}

const InputField = <
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
  type,
  inputContainerClassName,
  ...otherInputProps
}: InputFieldProps<FormValues, TName>) => {
  const [showPass, setShowPass] = useState(false);
  const form = useFormContext<FormValues>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeCustomize) {
      onChangeCustomize(e);
      return;
    }

    form.setValue(name, e.target.value as PathValue<FormValues, TName>);

    if (afterOnChange) {
      afterOnChange(e.target.value);
    }
  };

  const renderRightIcon = useCallback(() => {
    if (rightIcon) return rightIcon;

    if (type === "password") {
      if (showPass) return <EyeIcon onClick={() => setShowPass(false)} />;
      return <EyeOffIcon onClick={() => setShowPass(true)} />;
    }

    return null;
  }, [rightIcon, showPass, type]);

  const id = React.useId();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { onChange, ...otherProps } = field;
        return (
          <FormItem id={id} className="flex flex-col gap-1">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div
                className={cn(
                  "relative flex items-center gap-1.5 overflow-hidden",
                  "border border-neutral-90 transition-colors duration-200",
                  "hover:border-primary focus-within:border-primary",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "rounded-[10px]",
                  leftIcon && "pl-2",
                  (rightIcon || type === "password") && "pr-2",
                  inputContainerClassName
                )}
              >
                {leftIcon}
                <Input
                  onChange={handleChange}
                  {...otherInputProps}
                  {...otherProps}
                  type={showPass ? "text" : type}
                />
                {renderRightIcon()}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default InputField;
