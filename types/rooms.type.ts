import { FileMetadata, PaginationParams, SortOrder } from ".";
import { Contract } from "./contract.type";
import { House } from "./houses.type";

export interface Room {
  id: string;
  name: string;
  description: string;
  size_sq_m: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  contracts?: Contract[];
  house: House;
  totalExpenses: number;
  totalIncome: number;
  totalTenants: number;
  paymentDate: string;
  base_rent: number;
  maxTenant?: number;
}

export interface CreateRoomDto {
  name: string;
  house: string;
  description?: string;
  size_sq_m?: string;
  maxTenant: string;
}

export interface GetRoomByHouse extends PaginationParams {
  house: string;
}

export interface Expense {
  name: string;
  amount: string;
  date: string;
  notes?: string;
  receipt?: File;
  hasFile?: boolean;
}

export interface CreateRoomExpenseDto {
  roomId: string;
  expenses: Expense[];
}

export interface RoomExpense {
  id: string; // UUID
  room: Room; // Related room entity
  name: string;
  notes?: string;
  isAssetHandedOver: boolean;
  receipt?: FileMetadata;
  amount: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt: string | null;
}

export enum ComparisonEnum {
  BIGGER = "bigger",
  SMALLER = "smaller",
}

export interface GetRoomExpensesDto extends PaginationParams {
  room: string;
  from?: string;
  to?: string;
  search?: string;
  amount?: string;
  isAssetHandedOver?: string;
  comparison?: ComparisonEnum;
  sortBy?: string;
  sortOrder?: SortOrder;
}
