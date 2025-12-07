import ComboBoxTenantField from "@/components/common/fields/ComboBoxTenantField";
import InputField from "@/components/common/fields/InputField";
import NumericFormatField from "@/components/common/fields/NumericFormatField";
import ComboBoxTenant from "@/components/ui/combo-box-tenant";
import { Form } from "@/components/ui/form";
import useContractMutation from "@/hooks/contracts/useContractMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface AddOrEditContractFormProps {
  setIsDialogOpen: (open: boolean) => void;
  roomId: string;
}

const AddOrEditContractForm: FC<AddOrEditContractFormProps> = ({
  roomId,
  setIsDialogOpen,
}) => {
  const t = useTranslations("contract");
  const { createContract } = useContractMutation();

  const contractSchema = z.object({
    createdDate: z.date(),
    tenants: z.array(z.string()).min(1, t("validation.minTenant")),
    houseAddress: z.string().optional(),
    houseOwner: z.string().optional(),
    houseOwnerPhoneNumber: z.string().optional(),
    houseOwnerBackupPhoneNumber: z.string().optional(),
    overRentalFee: z.string().optional(),
    bankAccountName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankName: z.string().optional(),
  });

  const form = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      createdDate: new Date(),
      tenants: [],
    },
  });

  const onSubmit = (value: z.infer<typeof contractSchema>) => {
    createContract.mutate(value.tenants);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 mt-4"
      >
        <ComboBoxTenantField
          control={form.control}
          name="tenants"
          roomId={roomId}
        />

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 px-2">
            <InputField
              control={form.control}
              name="houseAddress"
              label={t("form.houseAddress")}
              placeholder={t("form.houseAddressPlaceholder")}
              required
            />
            <InputField
              control={form.control}
              name="houseOwner"
              label={t("form.houseOwner")}
              placeholder={t("form.houseOwnerPlaceholder")}
              required
            />

            <InputField
              control={form.control}
              name="houseOwnerPhoneNumber"
              label={t("form.houseOwnerPhoneNumber")}
              placeholder={t("form.houseOwnerPhoneNumberPlaceholder")}
              type="number"
              maxLength={10}
            />

            <InputField
              control={form.control}
              name="houseOwnerBackupPhoneNumber"
              label={t("form.houseOwnerBackupPhoneNumber")}
              placeholder={t("form.houseOwnerBackupPhoneNumberPlaceholder")}
              type="number"
              maxLength={10}
            />

            <div className="col-span-2">
              <NumericFormatField
                control={form.control}
                name="overRentalFee"
                label={t("form.overRentalFee")}
                placeholder={t("form.overRentalFeePlaceholder")}
                rightIcon={<span className="text-muted-foreground">₫</span>}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 px-2">
            <InputField
              control={form.control}
              name="bankAccountName"
              label={t("form.bankAccountName")}
              placeholder={t("form.bankAccountNamePlaceholder")}
            />

            <InputField
              control={form.control}
              name="bankAccountNumber"
              label={t("form.bankAccountNumber")}
              placeholder={t("form.bankAccountNumberPlaceholder")}
              type="number"
              maxLength={10}
            />

            <div className="col-span-2">
              <InputField
                control={form.control}
                name="bankName"
                label={t("form.bankName")}
                placeholder={t("form.bankNamePlaceholder")}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddOrEditContractForm;
