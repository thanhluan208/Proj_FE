"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn, numberToVietnameseText, trimTrailingZeros } from "@/lib/utils";
import BigNumber from "bignumber.js";
import { capitalize, isNil } from "lodash";
import { Fragment, ReactNode, useCallback, useMemo } from "react";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from "react-hook-form";
import {
  NumberFormatBase,
  NumberFormatValues,
  NumericFormatProps,
  useNumericFormat,
} from "react-number-format";

interface NumericFormatFieldProps<
  FormValues extends FieldValues,
  TName extends Path<FormValues>
> extends Omit<NumericFormatProps, "name" | "value" | "onChange"> {
  control: Control<FormValues, any>;
  name: TName;
  label: string;

  onChangeCustomize?: (values: any, sourceInfo: any) => void;
  afterOnChange?: (value: string) => void;

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  scale?: number;
  suffix?: string;
  max?: string;

  enabledNumberToText?: boolean;
  thousandSeparator?: string;
}

const NumericFormatField = <
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
  className,
  scale = 2,
  suffix,
  max = "1000000000000",
  enabledNumberToText = true,
  thousandSeparator,
  id,
  ...otherNumericFormatProps
}: NumericFormatFieldProps<FormValues, TName>) => {
  const form = useFormContext<FormValues>();

  const value = form.watch(name);

  const numberToText = useMemo(() => {
    if (!enabledNumberToText) return null;

    if (!value) return null;

    return capitalize(numberToVietnameseText(value));
  }, [enabledNumberToText, value]);

  const handleValueChange = (values: any, sourceInfo: any) => {
    if (onChangeCustomize) {
      onChangeCustomize(values, sourceInfo);
      return;
    }

    const { formattedValue, value, floatValue } = values;
    // Use the raw value for form state, you can adjust this based on your needs

    let newValue = "";

    if (!isNil(floatValue)) {
      newValue = BigNumber.minimum(floatValue, max).toString();
    }

    form.setValue(name, newValue as PathValue<FormValues, TName>);

    if (afterOnChange) {
      afterOnChange(floatValue || value || "");
    }
  };

  const formatinput = useCallback(
    (inputValue: string) => {
      if (inputValue === "" || isNil(inputValue)) return "";
      if (inputValue?.[0] === ".") return "0.";
      return (
        trimTrailingZeros(
          BigNumber(inputValue).toFormat(scale, BigNumber.ROUND_DOWN)
        ) +
        (inputValue.endsWith(".") ? "." : "") +
        (suffix ? ` ${suffix}` : "")
      );
    },
    [scale, suffix, thousandSeparator]
  );

  const renderRightIcon = useCallback(() => {
    if (rightIcon) return rightIcon;
    return null;
  }, [rightIcon]);

  const isAllowedInput = useCallback(
    (value: NumberFormatValues) => {
      if (BigNumber(value.floatValue || 0).isGreaterThan(BigNumber(max)))
        return false;
      return true;
    },
    [max]
  );

  const numericProps = useNumericFormat({
    allowNegative: false,
    isAllowed: isAllowedInput,
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { onChange, value, ...otherProps } = field;
        return (
          <FormItem id={id} className="flex flex-col gap-1">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div>
                <div
                  className={cn(
                    "relative flex items-center gap-1.5 overflow-hidden",
                    "border border-border transition-colors duration-200",
                    "hover:border-primary focus-within:border-primary",
                    "disabled:cursor-not-allowed mb-0 disabled:opacity-50",
                    "rounded-[10px]",
                    leftIcon && "pl-2",
                    rightIcon && "pr-2"
                  )}
                >
                  {leftIcon}
                  <NumberFormatBase
                    className={cn(
                      "flex h-10 w-full border-none bg-transparent px-3 py-2 text-sm",
                      "placeholder:text-muted-foreground",
                      "focus-visible:outline-none",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      className
                    )}
                    {...numericProps}
                    format={formatinput}
                    value={value}
                    onValueChange={handleValueChange}
                    {...otherNumericFormatProps}
                    {...otherProps}
                  />
                  {renderRightIcon()}
                </div>
                {enabledNumberToText && numberToText && (
                  <p className="text-xs text-neutral-400 ">{numberToText}</p>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default NumericFormatField;
