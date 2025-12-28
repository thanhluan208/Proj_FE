"use client";

import { useGetListTenant } from "@/hooks/tenants/useGetListTenant";
import { type FC, useMemo } from "react";
import ComboBoxApi, { SelectedItem } from "./combo-box-api";

export type SelectedTenant = SelectedItem;

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

const ComboBoxTenant: FC<ComboBoxTenantProps> = (props) => {
  const { roomId, ...rest } = props;

  const filter = useMemo(() => {
    return {
      room: roomId,
      page: 1,
      pageSize: 10,
      search: "",
      status: "active",
    };
  }, [roomId]);

  const { data, isFetching } = useGetListTenant(filter);

  const tenantList = data?.data || [];

  return (
    <ComboBoxApi
      {...rest}
      placeholder={props.placeholder || "combobox.tenantPlaceholder"}
      searchPlaceholder="Search tenant..."
      emptyMessage="No tenant found."
      data={tenantList}
      isLoading={isFetching}
      renderOption={(item) => (
        <div className="flex justify-between items-center w-full">
          <p>{item.name}</p>
          <p className="text-xs opacity-50">{(item as any).phoneNumber}</p>
        </div>
      )}
    />
  );
};

export default ComboBoxTenant;
