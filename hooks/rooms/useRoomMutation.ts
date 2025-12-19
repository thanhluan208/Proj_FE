import { QueryKeys } from "@/lib/constant";
import { RoomExpenseService, RoomsService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const useRoomMutation = () => {
  const translation = useTranslations("common");
  const queryClient = useQueryClient();

  const handleCreate = useMutation({
    mutationFn: RoomsService.createRoom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_LIST],
      });

      toast.success(translation("messages.createSuccess"));
    },
    onError: (error: any) => {
      console.log("error", error);
      const message =
        error?.response?.data?.message || translation("messages.createError");
      toast.error(message);
    },
  });

  const handleUpdate = useMutation({
    mutationFn: RoomsService.updateRoom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_DETAIL],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_LIST],
      });

      toast.success(translation("messages.updateSuccess"));
    },
    onError: (error: any) => {
      console.log("error", error);
      const message =
        error?.response?.data?.message || translation("messages.updateError");
      toast.error(message);
    },
  });

  const handleCreateExpense = useMutation({
    mutationFn: RoomExpenseService.createRoomExpense,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_DETAIL],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_EXPENSE_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_EXPENSE_PAGING],
      });

      toast.success(translation("messages.createSuccess"));
    },
    onError: (error: any) => {
      console.log("error", error);
      const message =
        error?.response?.data?.message || translation("messages.createError");
      toast.error(message);
    },
  });

  const handleUpdateExpense = useMutation({
    mutationFn: RoomExpenseService.updateRoomExpense,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_DETAIL],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_EXPENSE_LIST],
      });

      toast.success(translation("messages.updateSuccess"));
    },
    onError: (error: any) => {
      console.log("error", error);
      const message =
        error?.response?.data?.message || translation("messages.updateError");
      toast.error(message);
    },
  });

  const handleDeleteExpense = useMutation({
    mutationFn: RoomExpenseService.deleteRoomExpense,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_DETAIL],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_EXPENSE_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_EXPENSE_PAGING],
      });

      toast.success(translation("messages.deleteSuccess"));
    },
    onError: (error: any) => {
      console.log("error", error);
      const message =
        error?.response?.data?.message || translation("messages.deleteError");
      toast.error(message);
    },
  });

  return {
    createRoom: handleCreate,
    updateRoom: handleUpdate,
    createRoomExpense: handleCreateExpense,
    updateRoomExpense: handleUpdateExpense,
    deleteRoomExpense: handleDeleteExpense,
  };
};

export default useRoomMutation;
