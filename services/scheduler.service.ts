import { api } from "@/lib/apiHelpers";
import { BillingTypeEnum } from "@/types/billing.type";
import {
  CreateBillSchedulerDto,
  GetSchedulersDto,
  Scheduler,
} from "@/types/scheduler.type";

export const createBillScheduler = async (
  data: CreateBillSchedulerDto
): Promise<Scheduler> => {
  return api.post("/scheduler/bill", data).then((res) => res.data);
};

export const getSchedulers = async (
  params: GetSchedulersDto
): Promise<Scheduler[]> => {
  return api.get("/scheduler", { params }).then((res) => res.data);
};

export const getTotalSchedulers = async (
  params: GetSchedulersDto
): Promise<number> => {
  return api.get("/scheduler/total", { params }).then((res) => res.data);
};
