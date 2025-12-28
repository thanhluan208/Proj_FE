// hooks/scheduler/useGetListScheduler.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constant";
import { GetSchedulersDto } from "@/types/scheduler.type";
import {
  getSchedulers,
  getTotalSchedulers,
} from "@/services/scheduler.service";

export const useGetListScheduler = (params: GetSchedulersDto) => {
  return useQuery({
    queryKey: [
      QueryKeys.SCHEDULER_LIST,
      params.endDate,
      params.startDate,
      params.houseId,
      params.roomId,
    ],
    queryFn: () => getSchedulers(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetTotalScheduler = (params: GetSchedulersDto) => {
  return useQuery({
    queryKey: [
      QueryKeys.SCHEDULER_TOTAL,
      params.endDate,
      params.startDate,
      params.houseId,
      params.roomId,
    ],
    queryFn: () => getTotalSchedulers(params),
  });
};
