import { PaginationParams } from ".";
import { Tenant } from "./tenants.type";

export interface Contract {
  id: string;
  createdDate: string; // ISO timestamp
  startDate: string; // ISO timestamp
  endDate: string; // ISO timestamp

  base_rent: string;
  internet_fee: string;
  price_per_electricity_unit: string;
  price_per_water_unit: string;
  fixed_water_fee: string;
  fixed_electricity_fee: string;
  living_fee: string;
  parking_fee: string;
  cleaning_fee: string;
  overRentalFee: string;

  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  deletedAt: string | null;

  tenantContracts?: TenantContracts[];
}

interface TenantContracts {
  id: string;
  tenant: Tenant;
  isMainTenant?: boolean;
}

export type CreateContractDto = {
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

export interface QueryContracts extends PaginationParams {
  room: string;
  status: "active" | "inactive";
}
