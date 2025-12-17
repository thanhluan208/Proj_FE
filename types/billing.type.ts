import { PaginationParams, SortOrder } from ".";
import { Contract } from "./contract.type";
import { Tenant } from "./tenants.type";

export enum BillingStatusEnum {
  PENDING_OWNER_REVIEW = "PENDING_OWNER_REVIEW",
  PENDING_TENANT_PAYMENT = "PENDING_TENANT_PAYMENT",
  PAID = "PAID",
}

export interface HouseInfo {
  houseAddress?: string;
  houseOwner?: string;
  houseOwnerPhoneNumber?: string;
  houseOwnerBackupPhoneNumber?: string;
}
export interface BankInfo {
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

export interface CreateBillingDto {
  roomId: string;

  from: string; // ISO date string (e.g. "2023-10-01")
  to: string; // ISO date string

  notes?: string;

  electricity_start_index: string;
  electricity_end_index: string;

  water_start_index: string;
  water_end_index: string;

  houseInfo: HouseInfo;
  bankInfo: BankInfo;
}

export interface GetBillingDto extends PaginationParams {
  room: string;

  status?: BillingStatusEnum;
  type: BillingTypeEnum;

  from?: string; // ISO date string (e.g. "2023-10-01")
  to?: string; // ISO date string
}

export interface Billing {
  id: string;

  from: string; // ISO date string (YYYY-MM-DD)
  to: string; // ISO date string (YYYY-MM-DD)

  electricity_start_index: number;
  electricity_end_index: number;

  water_start_index: number;
  water_end_index: number;

  total_amount: number;

  status: BillingStatusEnum;
  type: BillingTypeEnum;

  payment_date: string | null;

  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  deletedAt: string | null;

  tenantContract: TenantContracts;
}

interface TenantContracts {
  id: string;
  tenant: Tenant;
  isMainTenant?: boolean;
  contract: Contract;
}

export enum BillingTypeEnum {
  RECURRING = "RECURRING",
  USAGE_BASED = "USAGE_BASED",
}
