export enum LANGUAGE {
  EN = "en",
  VI = "vi",
}

export enum STATUS_CODE {
  SUCCESS = 200,
  CREATED = 201,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  FAIL = 400,
}

export interface RoutesInterface {
  path: string;
  label: string;
  icon?: React.ReactNode;
  childrens?: RoutesInterface[];
  hideOnNav?: boolean;
}

export enum StatusEnum {
  ACTIVE = "ACTIVE",
  DEACTIVE = "INACTIVE",
}

export interface CommonOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface CommonResponse<T> {
  message: string;
  status: number;
  data?: T;
  error?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export type ViewMode = "card" | "table";

export interface FileMetadata {
  id: string;
  path: string;
  mimeType: string;
  size: number;
  originalName: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export interface RecordStatus {
  id: RecordStatusEnum;
  name: string;
}

export enum RecordStatusEnum {
  ACTIVE = "1",
  INACTIVE = "2",
}
