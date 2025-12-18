import React from "react";
import { Plus } from "lucide-react";
import RoomCard from "./RoomCard";
import { useMasonry } from "@/hooks/useMasonry";
import { useParams } from "next/navigation";
import { useGetListRoom } from "@/hooks/rooms/useGetListRoom";
import AddRoomButton from "./RoomAddOrEditButton";
import { isString } from "lodash";

const RoomList = () => {
  const { id } = useParams();
  const { data } = useGetListRoom({ house: String(id) || "" });
  const rooms = data?.data || [];

  const columns = useMasonry(data?.data || [], { 0: 1, 740: 2, 1440: 3 });

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-md p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Rooms ({rooms.length})</h2>
        {isString(id) && <AddRoomButton houseId={id} />}
      </div>

      <div className="flex gap-4 items-start">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex-1 space-y-4">
            {column.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
