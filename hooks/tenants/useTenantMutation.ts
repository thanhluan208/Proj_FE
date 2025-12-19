import { QueryKeys } from "@/lib/constant";
import {
  createTenant,
  editTenant,
  toggleTenantStatus,
  deleteTenant,
  updateTenantId,
  downloadTenantIdCards,
} from "@/services/tenants.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const useTenantMutation = () => {
  const t = useTranslations("tenant");
  const queryClient = useQueryClient();

  const handleCreate = useMutation({
    mutationFn: createTenant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT_PAGING],
      });

      toast.success(t("messages.createSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.createError");
      toast.error(message);
    },
  });

  const handleUpdateID = useMutation({
    mutationFn: updateTenantId,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT_PAGING],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT_DETAIL],
      });

      toast.success(t("messages.createSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.createError");
      toast.error(message);
    },
  });

  const handleEdit = useMutation({
    mutationFn: editTenant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT_DETAIL],
      });

      toast.success(t("messages.updateSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.updateError");
      toast.error(message);
    },
  });

  const handleToggleStatus = useMutation({
    mutationFn: toggleTenantStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT_LIST],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT_DETAIL],
      });

      toast.success(t("messages.toggleStatusSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.toggleStatusError");
      toast.error(message);
    },
  });

  const handleDelete = useMutation({
    mutationFn: deleteTenant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.TENANT_LIST],
      });

      toast.success(t("messages.deleteSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.deleteError");
      toast.error(message);
    },
  });

  const handleDownloadIdCards = useMutation({
    mutationFn: downloadTenantIdCards,
  });

  return {
    createTenant: handleCreate,
    editTenant: handleEdit,
    toggleStatus: handleToggleStatus,
    deleteTenant: handleDelete,
    updateTenantID: handleUpdateID,
    downloadIdCards: handleDownloadIdCards,
  };
};

export default useTenantMutation;
