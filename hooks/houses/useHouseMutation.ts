import { useRouter } from "@/i18n/routing";
import { QueryKeys, Routes } from "@/lib/constant";
import { HousesService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const useHouseMutation = () => {
  const translation = useTranslations("common");
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleCreate = useMutation({
    mutationFn: HousesService.createHouse,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.HOUSE_LIST],
      });

      toast.success(translation("messages.createSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || translation("messages.createError");
      toast.error(message);
    },
  });

  const handleUpdate = useMutation({
    mutationFn: HousesService.updateHouse,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.HOUSE_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.HOUSE_DETAIL],
      });

      toast.success(translation("messages.updateSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || translation("messages.updateError");
      toast.error(message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: HousesService.deleteHouse,
    onSuccess: async () => {
      router.push(Routes.ROOT);

      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.HOUSE_LIST],
      });

      toast.success(translation("messages.deleteSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || translation("messages.deleteError");
      toast.error(message);
    },
  });

  return {
    createHouse: handleCreate,
    deleteHouse: handleDelete,
    updateHouse: handleUpdate,
  };
};

export default useHouseMutation;
