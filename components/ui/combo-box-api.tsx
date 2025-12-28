"use client";

import { cn } from "@/lib/utils";
import { cloneDeep, isArray, isEmpty } from "lodash";
import { CheckIcon, ChevronsUpDown, X } from "lucide-react";
import { type ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { SpinIcon } from "../icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type SelectedItem = {
  id: string;
  name: string;
};

export interface ComboBoxApiProps<T extends SelectedItem> {
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;

  defaultValue?: SelectedItem | SelectedItem[];
  value?: string | string[];
  isMultiple?: boolean;
  disabled?: boolean;
  isError?: boolean;

  data: T[];
  isLoading: boolean;

  handleSelect: (value: string) => void;
  handleRemove: (value: string) => void;

  renderOption: (item: T | SelectedItem, isSelected: boolean) => ReactNode;
}

export function ComboBoxApi<T extends SelectedItem>({
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No result found.",
  defaultValue,
  value,
  isMultiple,
  disabled,
  isError,
  data = [],
  isLoading,
  handleSelect,
  handleRemove,
  renderOption,
}: ComboBoxApiProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = useMemo(() => {
    if (isMultiple) {
      if (isEmpty(value) && !isEmpty(defaultValue)) return defaultValue;
      if (isEmpty(value) && isEmpty(defaultValue)) return [];

      const valArray = value as string[];
      // Filter from data list
      const arr: SelectedItem[] = cloneDeep(data)
        .filter((elm) => valArray.some((sel) => sel === elm.id))
        .map((elm) => ({ id: elm.id, name: elm.name }));

      return [...arr, ...((defaultValue as SelectedItem[]) || [])];
    } else {
      if (value) {
        const found = data.find((elm) => elm.id === value);
        if (found) return { id: found.id, name: found.name };

        if (defaultValue && !isArray(defaultValue)) {
          return defaultValue;
        }
        return null;
      }
      if (defaultValue && !isArray(defaultValue)) return defaultValue;

      return null;
    }
  }, [value, defaultValue, isMultiple, data]);

  const handleChangeSearch = (val: string) => setSearch(val);

  const renderButtonContent = useCallback(() => {
    if (!selected || isEmpty(selected))
      return <span className="text-muted-foreground ">{placeholder}</span>;

    if (isMultiple && isArray(selected)) {
      return (
        <div className="flex gap-1 flex-wrap">
          {selected.map((elm) => {
            return (
              <div
                key={elm.id}
                className="px-3 py-1 rounded-md shadow-md bg-primary text-xs relative pr-7 text-amber-50 transition-shadow hover:shadow-xl"
              >
                {elm.name}
                <X
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(elm.id);
                  }}
                  className="absolute top-2/4 -translate-y-2/4 right-2 h-3.5 w-3.5 cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      );
    }

    if (!isMultiple && !isArray(selected)) {
      const selItem = selected as SelectedItem;
      return (
        <div className="flex justify-between pr-3">
          <p className="text-sm">{selItem.name}</p>
        </div>
      );
    }

    return <span className="text-muted-foreground ">{placeholder}</span>;
  }, [selected, isMultiple, placeholder, handleRemove]);

  const onSelect = (isSelected: boolean, id: string) => {
    if (isSelected) {
      handleRemove(id);
    } else {
      handleSelect(id);
    }

    if (!isMultiple) setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger ref={triggerRef} disabled={disabled}>
        <div
          className={cn(
            "w-full flex border border-border text-sm items-center hover:border-primary focus-within:border-primary rounded-lg px-4 py-2 justify-between bg-transparent",
            isError && "border-destructive text-destructive"
          )}
        >
          {renderButtonContent()}
          {isLoading ? <SpinIcon /> : <ChevronsUpDown className="opacity-50" />}
        </div>
      </PopoverTrigger>
      {open && (
        <PopoverContent
          className="w-full p-0"
          style={{
            width: `${triggerRef.current?.getBoundingClientRect().width}px`,
          }}
        >
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-9"
              value={search}
              onValueChange={handleChangeSearch}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {isArray(defaultValue) &&
                  defaultValue.map((elm) => {
                    if (data.some((item) => item.id === elm.id)) return null;

                    return (
                      <CommandItem
                        key={elm.id}
                        value={elm.id}
                        onSelect={() => handleRemove(elm.id)}
                        disabled={isLoading}
                        className={cn(
                          "hover:bg-primary-30 mt-1 cursor-pointer relative transition-colors [&>p]:font-normal  flex justify-between items-center",
                          "bg-primary-30 pr-7"
                        )}
                      >
                        {renderOption(elm, true)}
                        <CheckIcon className="absolute top-2/4 -translate-y-2/4 right-2" />
                      </CommandItem>
                    );
                  })}
                {data.map((elm) => {
                  const isSelected = isMultiple
                    ? (value as string[])?.includes(elm.id)
                    : value === elm.id;
                  return (
                    <CommandItem
                      key={elm.id}
                      value={elm.id}
                      onSelect={() => onSelect(isSelected, elm.id)}
                      disabled={isLoading}
                      className={cn(
                        "hover:bg-primary-30 mt-1 cursor-pointer relative transition-colors [&>p]:font-normal  flex justify-between items-center",
                        isSelected && "bg-primary-30 pr-7"
                      )}
                    >
                      {renderOption(elm, !!isSelected)}
                      {isSelected && (
                        <CheckIcon className="absolute top-2/4 -translate-y-2/4 right-2" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}

export default ComboBoxApi;
