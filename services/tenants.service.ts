import { api } from "@/lib/apiHelpers";
import { PaginationResponse } from "@/types";
import { CreateTenantDto, Tenant } from "@/types/tenants.type";

export const createTenant = async (data: CreateTenantDto): Promise<any> => {
  return api.post("/tenant/create", data).then((res) => res.data);
};

export const editTenant = async ({
  id,
  ...payload
}: Partial<CreateTenantDto> & { id: string }): Promise<any> => {
  return api.patch(`/tenant/${id}`, payload).then((res) => res.data);
};

export const getTenants = async (
  params: any
): Promise<PaginationResponse<Tenant>> => {
  return api.get("/tenant", { params }).then((res) => res.data);
};

export const toggleTenantStatus = async (id: string): Promise<Tenant> => {
  return api.post(`/tenant/${id}/toggle-status`).then((res) => res.data);
};

export const deleteTenant = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  return api.delete(`/tenant/${id}`).then((res) => res.data);
};
