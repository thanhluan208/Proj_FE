"use client";

import { useGetHouse } from "@/hooks/houses/useGetListHouse";
import { House } from "@/types/houses.type";
import { type FC } from "react";
import ComboBoxApi, { SelectedItem } from "./combo-box-api";

export type SelectedHouse = SelectedItem;

interface ComboBoxHouseProps {
  placeholder?: string;

  defaultValue?: SelectedHouse | SelectedHouse[];
  value?: string | string[];
  isMultiple?: boolean;
  disabled?: boolean;

  handleSelect: (value: string) => void;
  handleRemove: (value: string) => void;

  isError?: boolean;
}

const ComboBoxHouse: FC<ComboBoxHouseProps> = (props) => {
  const { data, isFetching } = useGetHouse();

  const houseList: House[] = data?.data || [];

  return (
    <ComboBoxApi<House>
      {...props}
      placeholder={props.placeholder || "Select house..."}
      searchPlaceholder="Search house..."
      emptyMessage="No house found."
      data={houseList}
      isLoading={isFetching}
      renderOption={(item) => (
        <div className="flex justify-between items-center w-full">
          <p>{item.name}</p>
          <p className="text-xs opacity-50 max-w-40">
            {(item as House).address}
          </p>
        </div>
      )}
    />
  );
};

export default ComboBoxHouse;
