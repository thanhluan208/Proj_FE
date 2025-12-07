import { QueryKeys } from "@/lib/constant";
import { RoomsService } from "@/services";
import { PaginationParams } from "@/types";
import { GetRoomByHouse } from "@/types/rooms.type";
import { useQuery } from "@tanstack/react-query";

export const useGetListRoom = (params?: GetRoomByHouse) => {
  const pageSize = params?.pageSize || 20;
  const page = params?.page || 1;

  return useQuery({
    queryKey: [QueryKeys.ROOM_LIST, pageSize, page],
    queryFn: () => RoomsService.getRooms(params),
  });
};
