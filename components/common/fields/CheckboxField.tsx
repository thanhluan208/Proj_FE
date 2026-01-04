"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ComponentPropsWithoutRef } from "react";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from "react-hook-form";

interface CheckBoxFieldProps<
  FormValues extends FieldValues,
  TName extends Path<FormValues>
> extends ComponentPropsWithoutRef<typeof Checkbox> {
  control: Control<FormValues>;
  name: TName;
  label?: string;
  description?: string;

  onCheckedChangeCustomize?: (checked: boolean) => void;
  afterOnChange?: (value: boolean) => void;
}

const CheckBoxField = <
  FormValues extends FieldValues,
  TName extends Path<FormValues>
>({
  control,
  name,
  label,
  description,
  onCheckedChangeCustomize,
  afterOnChange,
  id,
  ...otherProps
}: CheckBoxFieldProps<FormValues, TName>) => {
  const form = useFormContext<FormValues>();

  const handleCheckedChange = (checked: boolean) => {
    if (onCheckedChangeCustomize) {
      onCheckedChangeCustomize(checked);
      return;
    }

    form.setValue(name, checked as PathValue<FormValues, TName>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (afterOnChange) {
      afterOnChange(checked);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          id={id}
          className="flex flex-row items-center space-x-1 space-y-0"
        >
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={handleCheckedChange}
              {...otherProps}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckBoxField;
