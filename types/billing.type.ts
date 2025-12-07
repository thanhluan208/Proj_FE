import { PaginationParams } from ".";

export enum BillingStatusEnum {
  PENDING_OWNER_REVIEW = "PENDING_OWNER_REVIEW",
  PENDING_TENANT_PAYMENT = "PENDING_TENANT_PAYMENT",
  PAID = "PAID",
}

export interface Tenant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Billing {
  id: string;
  tenant: Tenant;
  room: {
    id: string;
    name: string;
  };
  month: Date;
  electricity_start_index: number;
  electricity_end_index: number;
  water_start_index: number;
  water_end_index: number;
  total_electricity_cost: number;
  total_water_cost: number;
  total_living_cost: number;
  total_parking_cost: number;
  total_cleaning_cost: number;
  base_rent: number;
  total_amount: number;
  status: BillingStatusEnum;
  payment_date?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingFilterParams extends PaginationParams {
  tenantId?: string;
  dateFrom?: string;
  dateTo?: string;
}
