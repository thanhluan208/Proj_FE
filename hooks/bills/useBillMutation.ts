import { QueryKeys } from "@/lib/constant";
import {
  createBill,
  deleteBill,
  downloadBill,
  downloadBillProof,
  payBill,
  updateBill,
} from "@/services/bill.service";
import { createContract, deleteContract } from "@/services/contracts.service";
import { CreateBillingDto } from "@/types/billing.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const useBillMutation = () => {
  const t = useTranslations("common");
  const queryClient = useQueryClient();

  const handleCreate = useMutation({
    mutationFn: createBill,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.BILLING_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.BILLING_PAGING],
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
    mutationFn: deleteBill,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.BILLING_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.BILLING_PAGING],
      });

      toast.success(t("messages.deleteSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.deleteError");
      toast.error(message);
    },
  });

  const handleUpdate = useMutation({
    mutationFn: ({ id, ...payload }: CreateBillingDto & { id: string }) =>
      updateBill(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.BILLING_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.BILLING_PAGING],
      });

      toast.success(t("messages.updateSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.updateError");
      toast.error(message);
    },
  });

  const handlePay = useMutation({
    mutationFn: payBill,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.BILLING_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.BILLING_PAGING],
      });

      toast.success(t("messages.updateSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.updateError");
      toast.error(message);
    },
  });

  const handleDownloadFile = useMutation({
    mutationFn: ({ id, isBillFile }: { id: string; isBillFile?: boolean }) => {
      if (isBillFile) return downloadBill(id);
      return downloadBillProof(id);
    },
  });

  return {
    createBill: handleCreate,
    deleteBill: handleDelete,
    updateBill: handleUpdate,
    payBill: handlePay,
    downloadFile: handleDownloadFile,
  };
};

export default useBillMutation;
