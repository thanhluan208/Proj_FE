import { QueryKeys } from "@/lib/constant";
import { HousesService } from "@/services";
import useUserStore from "@/stores/user-profile.store";
import { PaginationParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetHouseDetail = (id: string) => {
  const profile = useUserStore((state) => state.profile);

  return useQuery({
    queryKey: [QueryKeys.HOUSE_LIST, id, profile?.email],
    queryFn: () => HousesService.getHouseDetail(id),
    enabled: !!profile?.email && !!id,
  });
};
