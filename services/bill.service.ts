import { api } from "@/lib/apiHelpers";
import { queryStringify } from "@/lib/utils";
import { PaginationResponse } from "@/types";
import { Billing, CreateBillingDto, GetBillingDto } from "@/types/billing.type";
import { AxiosResponse } from "axios";

export const createBill = async (data: CreateBillingDto): Promise<Billing> => {
  return api.post("/billing/create", data).then((res) => res.data);
};

export const deleteBill = async (id: string): Promise<Billing> => {
  return api.delete(`/billing/${id}`).then((res) => res.data);
};

export const updateBill = async (
  id: string,
  data: CreateBillingDto
): Promise<Billing> => {
  return api.patch(`/billing/${id}`, data).then((res) => res.data);
};

export const payBill = async (formData: FormData): Promise<Billing> => {
  const id = formData.get("id");
  if (!id) throw new Error("No bill ID found!");

  formData.delete("id");
  return api
    .post(`/billing/${id}/pay`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const getBills = async (
  data: GetBillingDto
): Promise<PaginationResponse<Billing>> => {
  return api.get(`/billing?${queryStringify(data)}`).then((res) => res.data);
};

export const getTotalBill = async (
  data: GetBillingDto
): Promise<{ total: number }> => {
  return api
    .get(`/billing/paging?${queryStringify(data)}`)
    .then((res) => res.data);
};

export const downloadBill = async (
  id: string
): Promise<AxiosResponse<Blob>> => {
  return api.get(`/billing/${id}/download`, { responseType: "blob" });
};

export const downloadBillProof = async (
  id: string
): Promise<AxiosResponse<Blob>> => {
  return api.get(`/billing/${id}/download-proof`, { responseType: "blob" });
};
