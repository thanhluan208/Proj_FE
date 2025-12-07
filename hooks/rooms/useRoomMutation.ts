import { QueryKeys } from "@/lib/constant";
import { RoomsService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const useRoomMutation = () => {
  const translation = useTranslations("room");
  const queryClient = useQueryClient();

  const handleCreate = useMutation({
    mutationFn: RoomsService.createRoom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.ROOM_LIST],
      });

      toast.success(translation("messages.roomAddedSuccess"));
    },
    onError: (error: any) => {
      console.log('error', error)
      const message =
        error?.response?.data?.message || translation("messages.roomAddedError");
      toast.error(message);
    },
  });

  return { createRoom: handleCreate };
};

export default useRoomMutation;
