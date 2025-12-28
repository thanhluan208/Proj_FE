import { QueryKeys } from "@/lib/constant";
import { createBill } from "@/services/bill.service";
import { createBillScheduler } from "@/services/scheduler.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const useSchedulerMutation = () => {
  const t = useTranslations("common");
  const queryClient = useQueryClient();

  const handleCreateBill = useMutation({
    mutationFn: createBillScheduler,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.SCHEDULER],
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
    createBillScheduler: handleCreateBill,
  };
};

export default useSchedulerMutation;
