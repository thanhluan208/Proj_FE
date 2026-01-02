import { QueryKeys } from "@/lib/constant";
import { HousesService } from "@/services";
import useUserStore from "@/stores/user-profile.store";
import { PaginationParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface Options {
  params?: PaginationParams;
  enable?: boolean;
}

export const useGetHouse = (options?: Options) => {
  const profile = useUserStore((state) => state.profile);

  const { params, enable } = options || {};

  const pageSize = params?.pageSize || 10;
  const page = params?.page || 1;

  return useQuery({
    queryKey: [QueryKeys.HOUSE_LIST, pageSize, page],
    queryFn: () => HousesService.getHouses({ pageSize, page }),
    enabled: !!profile?.email,
  });
};
