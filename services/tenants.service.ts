import { api } from "@/lib/apiHelpers";
import { PaginationResponse } from "@/types";
import {
  CreateTenantDto,
  GetTenantParams,
  Tenant,
  UpdateTenantID,
} from "@/types/tenants.type";
import { AxiosResponse } from "axios";

export const createTenant = async (data: CreateTenantDto): Promise<any> => {
  return api.post("/tenant/create", data).then((res) => res.data);
};

export const updateTenantId = async (data: UpdateTenantID): Promise<Tenant> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value);
    }
  });

  return api
    .post(`/tenant/${data.roomId}/upload-id-card`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const editTenant = async ({
  id,
  ...payload
}: Partial<CreateTenantDto> & { id: string }): Promise<any> => {
  return api.patch(`/tenant/${id}`, payload).then((res) => res.data);
};

export const getTenants = async (
  params: GetTenantParams
): Promise<PaginationResponse<Tenant>> => {
  return api.get("/tenant", { params }).then((res) => res.data);
};

export const getTotalTenants = async (
  params: Omit<GetTenantParams, "page" | "pageSize">
): Promise<{ total: number }> => {
  return api.get("/tenant/paging", { params }).then((res) => res.data);
};

export const toggleTenantStatus = async (id: string): Promise<Tenant> => {
  return api.post(`/tenant/${id}/toggle-status`).then((res) => res.data);
};

export const deleteTenant = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  return api.delete(`/tenant/${id}`).then((res) => res.data);
};

export const downloadTenantIdCards = async (
  id: string
): Promise<AxiosResponse<Blob>> => {
  return api.get(`/tenant/${id}/download-id-cards`, { responseType: "blob" });
};
