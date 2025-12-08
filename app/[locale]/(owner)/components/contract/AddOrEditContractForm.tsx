import ComboBoxTenantField from "@/components/common/fields/ComboBoxTenantField";
import DatePickerField from "@/components/common/fields/DatePickerField";
import InputField from "@/components/common/fields/InputField";
import NumericFormatField from "@/components/common/fields/NumericFormatField";
import ButtonCancel from "@/components/ui/button-cancel";
import ButtonSubmit from "@/components/ui/button-submit";
import { Form } from "@/components/ui/form";
import useContractMutation from "@/hooks/contracts/useContractMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { FC, memo, useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";
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

  const isPending = createContract.isPending;

  const handleCancel = () => setIsDialogOpen(false);

  const contractSchema = z
    .object({
      createdDate: z.date(),
      startDate: z.date(),
      endDate: z.date(),
      tenants: z.array(z.string()).min(1, t("validation.minTenant")),
      houseAddress: z.string().optional(),
      houseOwner: z.string().optional(),
      houseOwnerPhoneNumber: z.string().optional(),
      houseOwnerBackupPhoneNumber: z.string().optional(),
      overRentalFee: z.string().optional(),
      bankAccountName: z.string().optional(),
      bankAccountNumber: z.string().optional(),
      bankName: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const { createdDate, startDate, endDate } = data;

      // Start must be AFTER created date
      if (startDate <= createdDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["startDate"],
          message: t("validation.startAfterCreated"),
        });
      }

      // End must be AFTER created date
      if (endDate <= createdDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: t("validation.endAfterCreated"),
        });
      }

      // End must be AFTER start
      if (endDate <= startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: t("validation.endAfterStart"),
        });
      }

      // Start must be BEFORE end (redundant but clearer)
      if (startDate >= endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["startDate"],
          message: t("validation.startBeforeEnd"),
        });
      }
    });

  const form = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      createdDate: new Date(),
      startDate: new Date(),
      endDate: dayjs().add(1, "year").toDate(),
      tenants: [],
      houseAddress: "",
      houseOwner: "",
      houseOwnerPhoneNumber: "",
      houseOwnerBackupPhoneNumber: "",
      overRentalFee: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankName: "",
    },
  });

  const onSubmit = (value: z.infer<typeof contractSchema>) => {
    const payload = {
      roomId: roomId,
      startDate: value.startDate.toISOString(),
      endDate: value.endDate.toISOString(),
      createdDate: dayjs().toISOString(),
      tenants: value.tenants,
      houseInfo: {
        houseAddress: value.houseAddress,
        houseOwner: value.houseOwner,
        houseOwnerPhoneNumber: value.houseOwnerPhoneNumber,
        houseOwnerBackupPhoneNumber: value.houseOwnerBackupPhoneNumber,
        overRentalFee: value.overRentalFee,
      },
      bankInfo: {
        bankAccountName: value.bankAccountName,
        bankAccountNumber: value.bankAccountNumber,
        bankName: value.bankName,
      },
    };

    createContract.mutate(payload);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 mt-4"
      >
        <FormEffect />

        <div className="grid grid-cols-2 gap-3 px-2">
          <ComboBoxTenantField
            control={form.control}
            name="tenants"
            roomId={roomId}
            placeholder={t("form.tenantsPlaceholder")}
            label={t("form.tenants")}
            isMultiple
          />

          <DatePickerField
            startMonth={dayjs().subtract(1, "year").startOf("year").toDate()}
            endMonth={dayjs().add(1, "year").endOf("year").toDate()}
            control={form.control}
            name="createdDate"
            placeholder={t("form.createdDatePlaceholder")}
            label={t("form.createdDate")}
          />

          <DatePickerField
            startMonth={dayjs().subtract(1, "year").startOf("year").toDate()}
            endMonth={dayjs().add(1, "year").endOf("year").toDate()}
            control={form.control}
            name="startDate"
            placeholder={t("form.startDatePlaceholder")}
            label={t("form.startDate")}
          />

          <DatePickerField
            startMonth={dayjs().subtract(1, "year").startOf("year").toDate()}
            endMonth={dayjs().add(1, "year").endOf("year").toDate()}
            control={form.control}
            name="endDate"
            placeholder={t("form.endDatePlaceholder")}
            label={t("form.endDate")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 px-2">
          <InputField
            control={form.control}
            name="houseAddress"
            label={t("form.houseAddress")}
            placeholder={t("form.houseAddressPlaceholder")}
          />
          <InputField
            control={form.control}
            name="houseOwner"
            label={t("form.houseOwner")}
            placeholder={t("form.houseOwnerPlaceholder")}
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

        <div className="grid grid-cols-2 gap-3 px-2">
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

        <div className="flex gap-3 mt-6 sticky bottom-0 bg-neutral-100 ">
          <ButtonCancel onClick={handleCancel} />

          <ButtonSubmit className="flex-1" isPending={isPending} />
        </div>
      </form>
    </Form>
  );
};

export default AddOrEditContractForm;

const FormEffect = memo(() => {
  const form = useFormContext();

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  useEffect(() => {
    form.trigger("endDate");
  }, [startDate]);

  useEffect(() => {
    form.trigger("startDate");
  }, [endDate]);

  return null;
});
