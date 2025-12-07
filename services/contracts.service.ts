import { api } from "@/lib/apiHelpers";

export const createContract = async (data: string[]): Promise<any> => {
  return api.post("/contract/create", data).then((res) => res.data);
};
