import { RecordStatus } from ".";

export interface House {
  id: string;
  name: string;
  description: string;
  address?: string;
  owner?: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  status: RecordStatus;
}

export interface CreateHouseDTO {
  name: string;
  description?: string;
  address?: string;
}
