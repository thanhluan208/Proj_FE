import { PaginationParams } from ".";
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

  contracts: Contract[];
}

export interface CreateRoomDto {
  name: string;
  house: string;
  description?: string;
}

export interface GetRoomByHouse extends PaginationParams {
  house: string;
}
