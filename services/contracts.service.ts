import { api } from "@/lib/apiHelpers";

type CreateContractDto = {
  roomId: string;
  createdDate: string;
  startDate: string;
  endDate: string;
  tenants: string[];
  houseInfo: {
    houseAddress?: string;
    houseOwner?: string;
    houseOwnerPhoneNumber?: string;
    houseOwnerBackupPhoneNumber?: string;
    overRentalFee?: string;
  };
  bankInfo: {
    bankAccountName?: string;
    bankAccountNumber?: string;
    bankName?: string;
  };
};

export const createContract = async (data: CreateContractDto): Promise<any> => {
  return api.post("/contracts/create", data).then((res) => res.data);
};
