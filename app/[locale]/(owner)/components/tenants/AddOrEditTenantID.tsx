import DropzoneField from "@/components/common/fields/DropzoneField";
import InputField from "@/components/common/fields/InputField";
import SelectField from "@/components/common/fields/SelectField";
import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useTenantMutation from "@/hooks/tenants/useTenantMutation";
import { CreateTenantDto, Tenant } from "@/types/tenants.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddOrEditTenantIDProps {
  setIsDialogOpen: (open: boolean) => void;
  data?: Tenant;
  roomId: string;
  setIdResult: (result: Tenant) => void;
}

const AddOrEditTenantID: FC<AddOrEditTenantIDProps> = ({
  setIsDialogOpen,
  data,
  roomId,
  setIdResult,
}) => {
  const t = useTranslations("tenant");
  const { updateTenantID } = useTenantMutation();
  const isPending = updateTenantID.isPending;

  const addTenantSchema = z.object({
    frontImage: z.array(z.any()).optional(),
    backImage: z.array(z.any()).optional(),
  });

  const form = useForm<z.infer<typeof addTenantSchema>>({
    resolver: zodResolver(addTenantSchema),
    defaultValues: {
      frontImage: [],
      backImage: [],
    },
  });

  const onSubmit = async (submitData: z.infer<typeof addTenantSchema>) => {
    if (!roomId) return;

    console.log("submit", submitData);

    const response = await updateTenantID.mutateAsync({
      roomId,
      id: data?.id,
      frontImage: submitData.frontImage?.[0],
      backImage: submitData.backImage?.[0],
    });

    if (response) setIdResult(response);
  };

  const handleCancel = () => {
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4 justify-between h-full"
      >
        <DropzoneField
          control={form.control}
          name="frontImage"
          label="Front ID"
          placeholder="Drop a file here or click to browse"
          maxFiles={1}
          maxSize={5 * 1024 * 1024} // 5MB
          accept={{
            "image/*": [".png", ".jpg", ".jpeg"],
          }}
        />

        <DropzoneField
          control={form.control}
          name="backImage"
          label="Back ID"
          placeholder="Drop a file here or click to browse"
          maxFiles={1}
          maxSize={5 * 1024 * 1024} // 5MB
          accept={{
            "image/*": [".png", ".jpg", ".jpeg"],
          }}
        />

        <div className="flex gap-3 mt-6 pb-6 sticky bottom-0 bg-neutral-100 ">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
            disabled={isPending}
          >
            {t("form.cancel")}
          </Button>

          <Button disabled={isPending} type="submit" className="flex-1">
            {isPending ? (
              <SpinIcon />
            ) : data ? (
              t("form.save")
            ) : (
              t("form.submit")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddOrEditTenantID;
