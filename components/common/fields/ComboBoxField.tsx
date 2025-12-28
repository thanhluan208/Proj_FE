import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { ComponentPropsWithoutRef, useCallback, useId } from "react";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from "react-hook-form";

export interface ComboBoxFieldRenderProps {
  handleSelect: (value: string) => void;
  handleRemove: (value: string) => void;
  value: any;
  isError: boolean;
  disabled?: boolean;
}

interface ComboBoxFieldProps<
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
> extends ComponentPropsWithoutRef<"div"> {
  label?: React.ReactNode;
  control: Control<TFieldValue, any>;
  name: TName;

  description?: string; // Optional static description
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  isMultiple?: boolean;

  onChangeCustomize?: (cur: string[] | string, value: string) => void;
  afterOnChange?: (cur: string[] | string, value: string) => void;
  onDeselectCustomize?: (cur: string[] | string, value: string) => void;
  afterOnDeselect?: (cur: string[] | string, value: string) => void;

  renderContent: (props: ComboBoxFieldRenderProps) => React.ReactNode;
  renderBottomMessage?: (props: { value: any }) => React.ReactNode;
}

const ComboBoxField = <
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
>({
  label,
  control,
  placeholder,
  afterOnChange,
  onChangeCustomize,
  afterOnDeselect,
  onDeselectCustomize,
  disabled,
  isMultiple,
  name,
  renderContent,
  renderBottomMessage,
}: ComboBoxFieldProps<TFieldValue, TName>) => {
  const id = useId();
  const form = useFormContext<TFieldValue>();

  const handleSelect = useCallback(
    (id: string) => {
      const cur = form.watch(name);

      if (onChangeCustomize) {
        onChangeCustomize(cur, id);
        return;
      }

      if (!isMultiple) {
        form.setValue(name, id as PathValue<TFieldValue, TName>, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        if (afterOnChange) afterOnChange([], id);
        return;
      }

      // Multiple logic
      const valArray = Array.isArray(cur) ? [...cur] : cur ? [cur] : [];
      valArray.push(id);

      form.setValue(name, valArray as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (afterOnChange) {
        afterOnChange(valArray, id);
      }
    },
    [form, name, onChangeCustomize, afterOnChange, isMultiple]
  );

  const handleRemove = useCallback(
    (id: string) => {
      const cur = form.watch(name);

      if (onDeselectCustomize) {
        onDeselectCustomize(cur, id);
        return;
      }

      if (!isMultiple) {
        form.setValue(name, "" as PathValue<TFieldValue, TName>, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        if (afterOnDeselect) afterOnDeselect([], id);
        return;
      }

      const valArray: string[] = Array.isArray(cur) ? cur : [];
      const newValue = valArray.filter((elm) => elm !== id);

      form.setValue(name, newValue as PathValue<TFieldValue, TName>, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (afterOnDeselect) {
        afterOnDeselect(newValue, id);
      }
    },
    [onDeselectCustomize, afterOnDeselect, name, form, isMultiple]
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
              {renderContent({
                handleSelect,
                handleRemove,
                value,
                isError,
                disabled,
              })}
            </FormControl>
            {renderBottomMessage && renderBottomMessage({ value })}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default ComboBoxField;
