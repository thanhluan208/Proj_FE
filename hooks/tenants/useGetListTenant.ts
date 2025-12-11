import { useQuery } from "@tanstack/react-query";
import { getTenants, getTotalTenants } from "@/services/tenants.service";
import { GetTenantParams } from "@/types/tenants.type";
import { QueryKeys } from "@/lib/constant";

export const useGetListTenant = (params: GetTenantParams) => {
  return useQuery({
    queryKey: [
      QueryKeys.TENANT_LIST,
      params.room,
      params.page,
      params.pageSize,
      params.status,
      params.dateFrom,
      params.dateTo,
      params.search,
    ],
    queryFn: () => getTenants(params),
    enabled: !!params.room,
  });
};

export const useGetTotalTenant = ({
  page,
  pageSize,
  ...params
}: GetTenantParams) => {
  return useQuery({
    queryKey: [
      QueryKeys.TENANT_PAGING,
      params.room,
      params.status,
      params.dateFrom,
      params.dateTo,
      params.search,
    ],
    queryFn: () => getTotalTenants(params),
    enabled: !!params.room,
  });
};
