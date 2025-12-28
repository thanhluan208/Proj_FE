"use client";

import { useGetListRoom } from "@/hooks/rooms/useGetListRoom";
import { Room } from "@/types/rooms.type";
import { type FC } from "react";
import ComboBoxApi, { SelectedItem } from "./combo-box-api";

export type SelectedRoom = SelectedItem;

interface ComboBoxRoomProps {
  placeholder?: string;
  houseId: string;

  defaultValue?: SelectedRoom | SelectedRoom[];
  value?: string | string[];
  isMultiple?: boolean;
  disabled?: boolean;

  handleSelect: (value: string) => void;
  handleRemove: (value: string) => void;

  isError?: boolean;
}

const ComboBoxRoom: FC<ComboBoxRoomProps> = (props) => {
  const { houseId, ...rest } = props;

  const { data, isFetching } = useGetListRoom({ house: houseId });

  const roomList: Room[] = data?.data || [];

  return (
    <ComboBoxApi<Room>
      {...rest}
      placeholder={props.placeholder || "Select room..."}
      searchPlaceholder="Search room..."
      emptyMessage="No room found."
      data={roomList}
      isLoading={isFetching}
      renderOption={(item) => (
        <div className="flex justify-between items-center w-full">
          <p>{item.name}</p>
          <p className="text-xs opacity-50">
            {(item as Room).maxTenant} tenants
          </p>
        </div>
      )}
    />
  );
};

export default ComboBoxRoom;
