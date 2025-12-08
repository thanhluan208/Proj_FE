import ComboBoxTenant from "@/components/ui/combo-box-tenant";
import { DatePicker } from "@/components/ui/date-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import dayjs from "dayjs";
import React, { ComponentPropsWithoutRef, useCallback, useId } from "react";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from "react-hook-form";

interface DatePickerFieldProps<
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
> extends ComponentPropsWithoutRef<"div"> {
  label?: React.ReactNode;
  control: Control<TFieldValue, any>;

  description?: string;
  placeholder?: string;

  onChangeCustomize?: (value: Date) => void;
  afterOnChange?: (value: Date) => void;
  disabledDate?: (value: Date) => boolean;

  disabled?: boolean;
  required?: boolean;

  name: TName;
  endMonth?: Date;
  startMonth?: Date;
}

const DatePickerField = <
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
>({
  label,
  control,
  placeholder,
  afterOnChange,
  onChangeCustomize,
  disabledDate,
  disabled,
  name,
  startMonth,
  endMonth,
}: DatePickerFieldProps<TFieldValue, TName>) => {
  const id = useId();

  const form = useFormContext<TFieldValue>();

  const handleSelect = useCallback(
    (date: Date) => {
      if (onChangeCustomize) {
        onChangeCustomize(date);
        return;
      }

      form.setValue(name, date as PathValue<TFieldValue, TName>, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (afterOnChange) {
        afterOnChange(date);
      }
    },
    [form, name, onChangeCustomize, afterOnChange]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { value } = field;
        const isError = !!fieldState.error;

        return (
          <FormItem id={id} className="flex flex-col gap-1">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <DatePicker
                date={dayjs(value).toDate()}
                setDate={handleSelect}
                disabled={disabled}
                placeholder={placeholder}
                isError={isError}
                disabledDate={disabledDate}
                startMonth={startMonth}
                endMonth={endMonth}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DatePickerField;
