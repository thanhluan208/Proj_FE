import { PaginationParams } from ".";
import { House } from "./houses.type";

export interface Room {
  id: string;
  name: string;
  description: string;
  size_sq_m: string;
  base_rent: string;
  price_per_electricity_unit: string;
  price_per_water_unit: string;
  fixed_water_fee: string;
  fixed_electricity_fee: string;
  living_fee: string;
  parking_fee: string;
  cleaning_fee: string;
  paymentDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  house: House;

  status: {
    id: number;
    name: string;
    color?: string;
  };

  totalTenants: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface CreateRoomDto {
  name: string;
  house: string;
  description?: string;
  size_sq_m: number;
  base_rent: number;
  price_per_electricity_unit?: number;
  price_per_water_unit?: number;
  fixed_water_fee?: number;
  fixed_electricity_fee?: number;
  living_fee?: number;
  parking_fee?: number;
  cleaning_fee?: number;
}

export interface GetRoomByHouse extends PaginationParams {
  house: string;
}
