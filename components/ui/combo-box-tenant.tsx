"use client";

import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import type { GetTenantParams } from "@/types/tenants.type";
import { isArray, isEmpty } from "lodash";
import { ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { useGetListTenant } from "@/hooks/tenants/useGetListTenant";
import { SpinIcon } from "../icons";
import useDebounce from "@/hooks/useDebounce";

type SelectedTenant = {
  id: string;
  name: string;
};

interface ComboBoxTenantProps {
  placeholder?: string;

  defaultValue?: SelectedTenant | SelectedTenant[];
  value?: SelectedTenant | SelectedTenant[];
  isMultiple?: boolean;

  roomId: string;

  handleSelect: (value: SelectedTenant) => void;
  handleRemove: (value: string) => void;
}

const ComboBoxTenant: FC<ComboBoxTenantProps> = ({
  placeholder = "combobox.tenantPlaceholder",
  defaultValue,
  value,
  isMultiple,
  roomId,

  handleSelect,
  handleRemove,
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

  const { data, isFetching } = useGetListTenant(filter);

  const tenantList = data?.data || [];

  const selected = useMemo(() => {
    if (isMultiple) {
      if (!isEmpty(value)) return value;
      if (!isEmpty(defaultValue)) return defaultValue;
    } else {
      if (value) return value;
      if (defaultValue) return value;
    }
  }, [value, defaultValue, isMultiple]);

  const handleChangeSearch = (value: string) => setSearch(value);

  const renderButtonContent = useCallback(() => {
    if (!selected) return placeholder;
    if (isMultiple && isArray(selected)) {
      return (
        <>
          {selected.map((elm) => {
            return (
              <div
                key={elm.id}
                className="px-3 py-1 rounded-md shadow-md bg-primary text-xs relative pr-4 hover:shadow-xl"
              >
                {elm.name}
                <X
                  onClick={() => handleRemove(elm.id)}
                  className="absolute top-2/4 -translate-y-2/4 right-2 h-3.5 w-3.5 cursor-pointer"
                />
              </div>
            );
          })}
        </>
      );
    }

    if (!isMultiple && !isArray(selected)) {
      return (
        <div className="flex justify-between pr-3">
          <p className="text-sm">{selected.name}</p>
          <X
            onClick={() => handleRemove(selected.id)}
            className="w-3.5 h-3.5 cursor-pointer"
          />
        </div>
      );
    }

    return placeholder;
  }, [selected, isMultiple, placeholder, handleRemove]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[350px] justify-between bg-transparent"
        >
          {renderButtonContent()}
          {isFetching ? "loading" : <ChevronsUpDown className="opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
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
              {tenantList.map((elm) => (
                <CommandItem
                  key={elm.id}
                  value={elm.id}
                  onSelect={() => {
                    handleSelect({
                      id: elm.id,
                      name: elm.name,
                    });
                  }}
                  disabled={isFetching}
                  className="hover:bg-primary-30 transition-colors [&>p]:font-normal hover:[&>p]:font-medium flex justify-between items-center"
                >
                  <p>{elm.name}</p>
                  <p className="text-xs opacity-50">{elm.phoneNumber}</p>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBoxTenant;
