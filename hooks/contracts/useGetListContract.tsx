import { QueryKeys } from "@/lib/constant";
import { getContracts, getTotalContract } from "@/services/contracts.service";
import { QueryContracts } from "@/types/contract.type";
import { useQuery } from "@tanstack/react-query";

export const useGetListContract = (params: QueryContracts) => {
  return useQuery({
    queryKey: [
      QueryKeys.CONTRACT_LIST,
      params.room,
      params.page,
      params.pageSize,
      params.status,
    ],
    queryFn: () => getContracts(params),
    enabled: !!params.room,
  });
};

export const useGetTotalContract = ({
  page,
  pageSize,
  ...params
}: QueryContracts) => {
  return useQuery({
    queryKey: [QueryKeys.CONTRACT_PAGING, params.room, params.status],
    queryFn: () => getTotalContract(params),
    enabled: !!params.room,
  });
};
