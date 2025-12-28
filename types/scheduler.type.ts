import { BillingTypeEnum } from "./billing.type";
import { Room } from "./rooms.type";

export interface CreateBillSchedulerDto {
  roomId: string;
  type: BillingTypeEnum;
}

export interface GetSchedulersDto {
  startDate: Date | string;
  endDate: Date | string;
  roomId?: string;
  houseId?: string;
}

export interface Scheduler {
  id: string;
  name: string;
  cronExpression: string;
  description?: string;
  isActive: boolean;
  metadata?: {
    jobType: SchedulerType;
  } & Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  startDate: string;
  endDate: string;
  room: Room;
}

export enum SchedulerType {
  BILL = "bill",
}
