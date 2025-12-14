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

interface AddTenantFormProps {
  setIsDialogOpen: (open: boolean) => void;
  houseId: string;
  roomId: string;
  data?: Tenant;
}

const AddOrEditTenantForm: FC<AddTenantFormProps> = ({
  setIsDialogOpen,
  houseId,
  roomId,
  data,
}) => {
  const t = useTranslations("tenant");
  const { createTenant, editTenant } = useTenantMutation();
  const isPending = createTenant.isPending;

  const addTenantSchema = z.object({
    name: z.string().min(1, { message: t("validation.nameRequired") }),
    dob: z.date().optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    citizenId: z.string().optional(),
    sex: z.string().optional(),
    nationality: z.string().optional(),
    home: z.string().optional(),
    issueDate: z.date().optional(),
    issueLoc: z.string().optional(),
    tenantJob: z.string().optional(),
    tenantWorkAt: z.string().optional(),
  });

  const form = useForm<z.infer<typeof addTenantSchema>>({
    resolver: zodResolver(addTenantSchema),
    defaultValues: {
      name: data?.name || "",
      address: data?.address || "",
      phoneNumber: data?.phoneNumber || "",
      citizenId: data?.citizenId || "",
      sex: data?.sex || "",
      nationality: data?.nationality || "",
      home: data?.home || "",
      issueLoc: data?.issueLoc || "",
      tenantJob: data?.tenantJob || "",
      tenantWorkAt: data?.tenantWorkAt || "",
      dob: data?.dob ? new Date(data.dob) : undefined,
      issueDate: data?.issueDate ? new Date(data.issueDate) : undefined,
    },
  });

  const onSubmit = async (submitData: z.infer<typeof addTenantSchema>) => {
    const payload: CreateTenantDto = {
      ...submitData,
      house: houseId,
      room: roomId,
      dob: submitData.dob?.toISOString(),
      issueDate: submitData.issueDate?.toISOString(),
    };

    let response: any = null;
    if (data) {
      const { house, room, ...rest } = payload;
      response = await editTenant.mutateAsync({ ...rest, id: data.id });
    } else {
      response = await createTenant.mutateAsync(payload);
    }

    if (response) {
      setIsDialogOpen(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4 "
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            control={form.control}
            name="name"
            label={t("form.name")}
            placeholder={t("form.namePlaceholder")}
            required
          />
          <InputField
            control={form.control}
            name="phoneNumber"
            label={t("form.phoneNumber")}
            placeholder={t("form.phoneNumberPlaceholder")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>{t("form.dob")}</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SelectField
            name="sex"
            control={form.control}
            options={[
              { label: t("gender.male"), value: "Male" },
              { label: t("gender.female"), value: "Female" },
              { label: t("gender.other"), value: "Other" },
            ]}
            label={t("form.sex")}
            placeholder={t("form.sexPlaceholder")}
          />
        </div>

        <InputField
          control={form.control}
          name="address"
          label={t("form.address")}
          placeholder={t("form.addressPlaceholder")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            control={form.control}
            name="citizenId"
            label={t("form.citizenId")}
            placeholder={t("form.citizenIdPlaceholder")}
          />
          <InputField
            control={form.control}
            name="nationality"
            label={t("form.nationality")}
            placeholder={t("form.nationalityPlaceholder")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            control={form.control}
            name="home"
            label={t("form.home")}
            placeholder={t("form.homePlaceholder")}
          />
          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("form.issueDate")}</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <InputField
          control={form.control}
          name="issueLoc"
          label={t("form.issueLoc")}
          placeholder={t("form.issueLocPlaceholder")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            control={form.control}
            name="tenantJob"
            label={t("form.tenantJob")}
            placeholder={t("form.tenantJobPlaceholder")}
          />
          <InputField
            control={form.control}
            name="tenantWorkAt"
            label={t("form.tenantWorkAt")}
            placeholder={t("form.tenantWorkAtPlaceholder")}
          />
        </div>

        <div className="flex gap-3 mt-6 sticky bottom-0 bg-neutral-100 ">
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

export default AddOrEditTenantForm;
