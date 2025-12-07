import { QueryKeys } from "@/lib/constant";
import { createContract } from "@/services/contracts.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const useContractMutation = () => {
  const t = useTranslations("contract");
  const queryClient = useQueryClient();

  const handleCreate = useMutation({
    mutationFn: createContract,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONTRACT_LIST],
      });

      toast.success(t("messages.createSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || t("messages.createError");
      toast.error(message);
    },
  });

  return {
    createContract: handleCreate,
  };
};

export default useContractMutation;
