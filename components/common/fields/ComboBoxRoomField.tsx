import ComboBoxRoom from "@/components/ui/combo-box-room";
import React, { ComponentPropsWithoutRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import ComboBoxField from "./ComboBoxField";

interface ComboBoxRoomFieldProps<
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
> extends ComponentPropsWithoutRef<"div"> {
  label?: React.ReactNode;
  control: Control<TFieldValue, any>;

  description?: string;
  placeholder?: string;
  houseId: string;

  onChangeCustomize?: (cur: string[] | string, value: string) => void;
  afterOnChange?: (cur: string[] | string, value: string) => void;
  onDeselectCustomize?: (cur: string[] | string, value: string) => void;
  afterOnDeselect?: (cur: string[] | string, value: string) => void;

  disabled?: boolean;
  required?: boolean;
  isMultiple?: boolean;

  name: TName;
}

const ComboBoxRoomField = <
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
>({
  houseId,
  placeholder,
  ...props
}: ComboBoxRoomFieldProps<TFieldValue, TName>) => {
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
        <ComboBoxRoom
          houseId={houseId}
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

export default ComboBoxRoomField;
