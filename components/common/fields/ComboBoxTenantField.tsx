import ComboBoxTenant, {
  SelectedTenant,
} from "@/components/ui/combo-box-tenant";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { ComponentPropsWithoutRef, useCallback, useId } from "react";
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from "react-hook-form";

interface ComboBoxTenantFieldProps<
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
> extends ComponentPropsWithoutRef<"div"> {
  label?: React.ReactNode;
  control: Control<TFieldValue, any>;

  description?: string;
  placeholder?: string;

  onChangeCustomize?: (cur: string[], value: string) => void;
  afterOnChange?: (cur: string[], value: string) => void;
  onDeselectCustomize?: (cur: string[], value: string) => void;
  afterOnDeselect?: (cur: string[], value: string) => void;

  roomId: string;
  disabled?: boolean;
  required?: boolean;
  isMultiple?: boolean;

  name: TName;
}

const ComboBoxTenantField = <
  TFieldValue extends FieldValues,
  TName extends Path<TFieldValue>
>({
  label,
  control,
  description,
  placeholder,
  afterOnChange,
  onChangeCustomize,
  afterOnDeselect,
  onDeselectCustomize,
  disabled,
  roomId,
  isMultiple,
  name,
}: ComboBoxTenantFieldProps<TFieldValue, TName>) => {
  const id = useId();

  const form = useFormContext<TFieldValue>();

  const handleSelect = useCallback(
    (id: string) => {
      const cur: string[] = form.watch(name) || [];

      if (onChangeCustomize) {
        onChangeCustomize(cur, id);
        return;
      }

      cur.push(id);
      form.setValue(name, cur as PathValue<TFieldValue, TName>, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (afterOnChange) {
        afterOnChange(cur, id);
      }
    },
    [form, name, onChangeCustomize, afterOnChange]
  );

  const handleRemove = useCallback(
    (id: string) => {
      const cur: string[] = form.watch(name) || [];

      if (onDeselectCustomize) {
        onDeselectCustomize(cur, id);
        return;
      }

      const newValue = cur.filter((elm) => elm !== id);
      form.setValue(name, newValue as PathValue<TFieldValue, TName>, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (afterOnDeselect) {
        afterOnDeselect(newValue, id);
      }
    },
    [onDeselectCustomize, afterOnDeselect, name, form]
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
              <ComboBoxTenant
                roomId={roomId}
                handleRemove={handleRemove}
                handleSelect={handleSelect}
                value={value}
                isMultiple
                isError={isError}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default ComboBoxTenantField;
