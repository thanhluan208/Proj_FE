"use client";

import { useGetListTenant } from "@/hooks/tenants/useGetListTenant";
import type { GetTenantParams } from "@/types/tenants.type";
import { cloneDeep, isArray, isEmpty } from "lodash";
import { Check, CheckIcon, ChevronsUpDown, X } from "lucide-react";
import { type FC, useCallback, useMemo, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { SpinIcon } from "../icons";
import { cn } from "@/lib/utils";

export type SelectedTenant = {
  id: string;
  name: string;
};

interface ComboBoxTenantProps {
  placeholder?: string;

  defaultValue?: SelectedTenant | SelectedTenant[];
  value?: string | string[];
  isMultiple?: boolean;
  disabled?: boolean;

  roomId: string;

  handleSelect: (value: string) => void;
  handleRemove: (value: string) => void;

  isError?: boolean;
}

const ComboBoxTenant: FC<ComboBoxTenantProps> = ({
  placeholder = "combobox.tenantPlaceholder",
  defaultValue,
  value,
  isMultiple,
  roomId,
  disabled,

  handleSelect,
  handleRemove,

  isError,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<GetTenantParams>({
    room: roomId,
    page: 1,
    pageSize: 10,
    search: "",
    status: "active",
  });

  const triggerRef = useRef<HTMLButtonElement>(null);

  const { data, isFetching } = useGetListTenant(filter);

  const tenantList = data?.data || [];

  const selected = useMemo(() => {
    if (isMultiple) {
      if (isEmpty(value) && !isEmpty(defaultValue)) return defaultValue;
      if (isEmpty(value) && isEmpty(defaultValue)) return [];

      const arr: SelectedTenant[] = cloneDeep(tenantList)
        .filter((elm) => (value as string[]).some((sel) => sel === elm.id))
        .map((elm) => ({ id: elm.id, name: elm.name }));

      return [...arr, ...((defaultValue as SelectedTenant[]) || [])];
    } else {
      if (value)
        return (
          tenantList.find((elm) => elm.id === value) || defaultValue || null
        );
      if (defaultValue) return defaultValue;

      return null;
    }
  }, [value, defaultValue, isMultiple, tenantList]);

  const handleChangeSearch = (value: string) => setSearch(value);

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
      return (
        <div className="flex justify-between pr-3">
          <p className="text-sm">{selected.name}</p>
          <X
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(selected.id);
            }}
            className="w-3.5 h-3.5 cursor-pointer"
          />
        </div>
      );
    }

    return <span className="text-muted-foreground ">{placeholder}</span>;
  }, [selected, isMultiple, placeholder, handleRemove]);

  const renderComboBoxValue = useCallback(
    (elm: SelectedTenant & { phoneNumber?: string }, isSelected: boolean) => {
      return (
        <CommandItem
          key={elm.id}
          value={elm.id}
          onSelect={() => {
            if (isSelected) {
              handleRemove(elm.id);
            } else {
              handleSelect(elm.id);
            }
          }}
          disabled={isFetching}
          className={cn(
            "hover:bg-primary-30 mt-1 cursor-pointer relative transition-colors [&>p]:font-normal  flex justify-between items-center",
            isSelected && "bg-primary-30 pr-7"
          )}
        >
          <p>{elm.name}</p>
          <p className="text-xs opacity-50">{elm.phoneNumber}</p>
          {isSelected && (
            <CheckIcon className="absolute top-2/4 -translate-y-2/4 right-2" />
          )}
        </CommandItem>
      );
    },
    [isFetching]
  );

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
          {isFetching ? (
            <SpinIcon />
          ) : (
            <ChevronsUpDown className="opacity-50" />
          )}
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
              placeholder="Search framework..."
              className="h-9"
              value={search}
              onValueChange={handleChangeSearch}
            />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {isArray(defaultValue) &&
                  defaultValue.map((elm) => {
                    if (tenantList.some((tenant) => tenant.id === elm.id))
                      return null;
                    const isSelected = true;
                    return renderComboBoxValue(elm, isSelected);
                  })}
                {tenantList.map((elm) => {
                  const isSelected = isMultiple
                    ? value?.includes(elm?.id)
                    : value === elm.id;
                  return renderComboBoxValue(elm, !!isSelected);
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default ComboBoxTenant;
