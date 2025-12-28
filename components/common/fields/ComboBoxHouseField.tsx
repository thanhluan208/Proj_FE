import ComboBoxHouse from "@/components/ui/combo-box-house";
import React, { ComponentPropsWithoutRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import ComboBoxField from "./ComboBoxField";

interface ComboBoxHouseFieldProps<
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
> extends ComponentPropsWithoutRef<"div"> {
  label?: React.ReactNode;
  control: Control<TFieldValue, any>;

  description?: string;
  placeholder?: string;

  onChangeCustomize?: (cur: string[] | string, value: string) => void;
  afterOnChange?: (cur: string[] | string, value: string) => void;
  onDeselectCustomize?: (cur: string[] | string, value: string) => void;
  afterOnDeselect?: (cur: string[] | string, value: string) => void;

  disabled?: boolean;
  required?: boolean;
  isMultiple?: boolean;

  name: TName;
}

const ComboBoxHouseField = <
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
>({
  placeholder,
  ...props
}: ComboBoxHouseFieldProps<TFieldValue, TName>) => {
  return (
    <ComboBoxField
      {...props}
      renderContent={({
        handleSelect,
        handleRemove,
        value,
        isError,
        disabled,
      }) => (
        <ComboBoxHouse
          handleRemove={handleRemove}
          handleSelect={handleSelect}
          placeholder={placeholder}
          value={value}
          isMultiple={props.isMultiple}
          disabled={disabled}
          isError={isError}
        />
      )}
    />
  );
};

export default ComboBoxHouseField;
