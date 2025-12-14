import { api } from "@/lib/apiHelpers";
import { queryStringify } from "@/lib/utils";
import { PaginationResponse } from "@/types";
import {
  CreateRoomDto,
  CreateRoomExpenseDto,
  GetRoomByHouse,
  Room,
  RoomExpense,
} from "@/types/rooms.type";

export const getRooms = async (
  payload?: GetRoomByHouse
): Promise<PaginationResponse<Room>> => {
  return api.get(`/rooms?${queryStringify(payload)}`).then((res) => res.data);
};

export const createRoom = async (data: CreateRoomDto): Promise<Room> => {
  return api.post("/rooms/create", data).then((res) => res.data);
};

export const getRoomDetail = async (id: string): Promise<Room> => {
  return api.get(`/rooms/${id}`).then((res) => res.data);
};
