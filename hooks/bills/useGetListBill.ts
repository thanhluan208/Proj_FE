// hooks/useGetBilling.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/lib/constant";
import { GetBillingDto } from "@/types/billing.type";
import { getBills, getTotalBill } from "@/services/bill.service";

export const useGetListBilling = (params: GetBillingDto) => {
  return useQuery({
    queryKey: [
      QueryKeys.BILLING_LIST,
      params.room,
      params.page,
      params.pageSize,
      params.status,
      params.from,
      params.to,
      params.sortBy,
      params.sortOrder,
      params.type,
    ],
    queryFn: () => getBills(params),
    enabled: !!params.room,
    placeholderData: keepPreviousData,
  });
};

export const useGetTotalBilling = ({
  page,
  pageSize,
  ...params
}: GetBillingDto) => {
  return useQuery({
    queryKey: [
      QueryKeys.BILLING_PAGING,
      params.room,
      params.status,
      params.from,
      params.to,
      params.type,
    ],
    queryFn: () => getTotalBill(params),
    enabled: !!params.room,
  });
};
