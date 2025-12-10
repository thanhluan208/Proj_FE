import { api } from "@/lib/apiHelpers";
import { queryStringify } from "@/lib/utils";
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
): Promise<Contract[]> => {
  return api.get(`/contracts?${queryStringify(data)}`).then((res) => res.data);
};
