import { QueryKeys } from "@/lib/constant";
import {
  createContract,
  deleteContract,
  downloadContractFile,
  toggleContractStatus,
} from "@/services/contracts.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const useContractMutation = () => {
  const t = useTranslations("common");
  const queryClient = useQueryClient();

  const handleCreate = useMutation({
    mutationFn: createContract,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONTRACT_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONTRACT_PAGING],
      });

      toast.success(t("messages.createSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.createError");
      toast.error(message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: deleteContract,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONTRACT_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONTRACT_PAGING],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.SCHEDULER_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.SCHEDULER_TOTAL],
      });

      toast.success(t("messages.deleteSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.deleteError");
      toast.error(message);
    },
  });

  const handleToggleStatus = useMutation({
    mutationFn: toggleContractStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONTRACT_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONTRACT_PAGING],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.SCHEDULER_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.SCHEDULER_TOTAL],
      });

      toast.success(t("messages.updateSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.updateError");
      toast.error(message);
    },
  });

  const handleDownload = useMutation({
    mutationFn: (id: string) => downloadContractFile(id),
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.downloadError");
      toast.error(message);
    },
  });

  return {
    createContract: handleCreate,
    deleteContract: handleDelete,
    toggleContractStatus: handleToggleStatus,
    downloadContract: handleDownload,
  };
};

export default useContractMutation;
