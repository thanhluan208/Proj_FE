export interface Tenant {
  id: string;
  name: string;
  phoneNumber?: string;
  dob?: Date;
  address?: string;
  citizenId?: string;
  sex?: string;
  nationality?: string;
  home?: string;
  issueDate?: Date;
  issueLoc?: string;
  frontIdCardImagePath?: string;
  backIdCardImagePath?: string;
  tenantJob?: string;
  tenantWorkAt?: string;
  status?: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantDto {
  room: string;
  house: string;
  name: string;
  dob?: string;
  address?: string;
  phoneNumber?: string;
  citizenId?: string;
  sex?: string;
  nationality?: string;
  home?: string;
  issueDate?: string;
  issueLoc?: string;
  tenantJob?: string;
  tenantWorkAt?: string;
}

export interface UpdateTenantID {
  id?: string;
  roomId: string;
  frontImage?: File;
  backImage?: File;
}

export interface GetTenantParams {
  room: string;
  page?: number;
  pageSize?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
