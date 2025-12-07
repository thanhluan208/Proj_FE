import { QueryKeys } from "@/lib/constant";
import { RoomsService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useGetRoomDetail = (id: string) => {
  return useQuery({
    queryKey: [QueryKeys.ROOM_DETAIL, id],
    queryFn: () => RoomsService.getRoomDetail(id),
    enabled: !!id,
  });
};
