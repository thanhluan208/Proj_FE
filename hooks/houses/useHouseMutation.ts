import { QueryKeys } from "@/lib/constant";
import { HousesService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

const useHouseMutation = () => {
  const translation = useTranslations("property");
  const queryClient = useQueryClient();

  const handleCreate = useMutation({
    mutationFn: HousesService.createHouse,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.HOUSE_LIST],
      });

      toast.success(translation("messages.houseAddedSuccess"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error || translation("messages.houseAddedError");
      toast.error(message);
    },
  });

  return { createHouse: handleCreate };
};

export default useHouseMutation;
