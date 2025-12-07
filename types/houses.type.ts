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
}

export interface CreateHouseDTO {
  name: string;
  description?: string;
}
