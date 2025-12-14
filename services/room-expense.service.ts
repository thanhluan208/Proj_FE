import { api } from "@/lib/apiHelpers";
import { queryStringify } from "@/lib/utils";
import { PaginationResponse } from "@/types";
import {
  CreateRoomExpenseDto,
  Expense,
  GetRoomExpensesDto,
  RoomExpense,
} from "@/types/rooms.type";

export const createRoomExpense = async (
  data: CreateRoomExpenseDto
): Promise<RoomExpense[]> => {
  const formData = new FormData();
  formData.append("roomId", data.roomId);

  const expenses: Expense[] = [];

  data.expenses.forEach((elm) => {
    const { receipt, ...expenseData } = elm;
    if (receipt instanceof File) {
      formData.append("receipts", receipt);
      expenses.push({
        ...expenseData,
        hasFile: true,
      });
    } else {
      expenses.push(expenseData);
    }
  });

  formData.append("expenses", JSON.stringify(expenses));

  return api
    .post("/room-expenses/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const updateRoomExpense = async (
  data: Partial<
    Omit<RoomExpense, "receipt"> & { receipt?: File; roomId: string }
  >
): Promise<RoomExpense | null> => {
  const formData = new FormData();

  const { id, ...payload } = data;

  if (!id) return null;

  Object.entries(payload).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value as string | File);
    }
  });

  return api
    .patch(`/room-expenses/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const deleteRoomExpense = async (
  id: string
): Promise<PaginationResponse<RoomExpense>> => {
  return api.delete(`/room-expenses/${id}`).then((res) => res.data);
};

export const getRoomExpenses = async (
  payload: GetRoomExpensesDto
): Promise<PaginationResponse<RoomExpense>> => {
  const { room, ...params } = payload;
  return api
    .get(`/room-expenses/room/${room}?${queryStringify(params)}`)
    .then((res) => res.data);
};

export const getTotalRoomExpenses = async (
  payload: GetRoomExpensesDto
): Promise<{ total: number }> => {
  const { room, page, pageSize, ...params } = payload;
  return api
    .get(`/room-expenses/room/${room}/paging?${queryStringify(params)}`)
    .then((res) => res.data);
};
