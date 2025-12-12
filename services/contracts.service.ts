import { api } from "@/lib/apiHelpers";
import { queryStringify } from "@/lib/utils";
import { PaginationResponse } from "@/types";
import {
  Contract,
  CreateContractDto,
  QueryContracts,
} from "@/types/contract.type";

export const createContract = async (
  data: CreateContractDto
): Promise<Contract> => {
  return api.post("/contracts/create", data).then((res) => res.data);
};

export const getContracts = async (
  data: QueryContracts
): Promise<PaginationResponse<Contract>> => {
  return api.get(`/contracts?${queryStringify(data)}`).then((res) => res.data);
};

export const getTotalContract = async (
  data: QueryContracts
): Promise<{ total: number }> => {
  return api
    .get(`/contracts/paging?${queryStringify(data)}`)
    .then((res) => res.data);
};

export const deleteContract = async (id: string): Promise<Contract> => {
  return api.delete(`/contracts/${id}`).then((res) => res.data);
};
