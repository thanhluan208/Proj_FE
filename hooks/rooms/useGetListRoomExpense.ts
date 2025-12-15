import { QueryKeys } from "@/lib/constant";
import {
  getRoomExpenses,
  getTotalRoomExpenses,
} from "@/services/room-expense.service";
import { GetRoomExpensesDto } from "@/types/rooms.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetListExpense = (params: GetRoomExpensesDto) => {
  return useQuery({
    queryKey: [
      QueryKeys.ROOM_EXPENSE_LIST,
      params.room,
      params.page,
      params.pageSize,
      params.from,
      params.to,
      params.search,
      params.amount,
      params.comparison,
      params.sortBy,
      params.sortOrder,
    ],
    queryFn: () => getRoomExpenses(params),
    enabled: !!params.room,
    placeholderData: keepPreviousData,
  });
};

export const useGetTotalExpense = ({
  page,
  pageSize,
  ...params
}: GetRoomExpensesDto) => {
  return useQuery({
    queryKey: [
      QueryKeys.ROOM_EXPENSE_PAGING,
      params.room,
      params.from,
      params.to,
      params.search,
      params.amount,
      params.comparison,
    ],
    queryFn: () => getTotalRoomExpenses(params),
    enabled: !!params.room,
  });
};
