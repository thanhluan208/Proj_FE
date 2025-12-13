import { api } from "@/lib/apiHelpers";
import { queryStringify } from "@/lib/utils";
import { PaginationResponse } from "@/types";
import { CreateBillingDto, GetBillingDto } from "@/types/billing.type";

export const createBill = async (data: CreateBillingDto): Promise<any> => {
  return api.post("/billing/create", data).then((res) => res.data);
};

export const getBills = async (
  data: GetBillingDto
): Promise<PaginationResponse<any>> => {
  return api.get(`/billing?${queryStringify(data)}`).then((res) => res.data);
};

export const getTotalBill = async (
  data: GetBillingDto
): Promise<{ total: number }> => {
  return api
    .get(`/billing/paging?${queryStringify(data)}`)
    .then((res) => res.data);
};
