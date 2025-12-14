import DatePickerField from "@/components/common/fields/DatePickerField";
import InputField from "@/components/common/fields/InputField";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ButtonCancel from "@/components/ui/button-cancel";
import ButtonSubmit from "@/components/ui/button-submit";
import { Form } from "@/components/ui/form";
import useBillMutation from "@/hooks/bills/useBillMutation";
import { Billing, CreateBillingDto } from "@/types/billing.type";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface AddOrEditBillingFormProps {
  setIsDialogOpen: (open: boolean) => void;
  roomId: string;
  data?: Billing;
}

const AddOrEditBillingForm: FC<AddOrEditBillingFormProps> = ({
  roomId,
  setIsDialogOpen,
  data,
}) => {
  const t = useTranslations("bill");
  const tCommon = useTranslations("common");
  const { createBill, updateBill } = useBillMutation();

  const isPending = createBill.isPending || updateBill.isPending;

  const handleCancel = () => setIsDialogOpen(false);

  const schema = z.object({
    from: z.date(),
    to: z.date(),
    notes: z.string().optional(),

    houseAddress: z.string().optional(),
    houseOwner: z.string().optional(),
    houseOwnerPhoneNumber: z.string().optional(),
    houseOwnerBackupPhoneNumber: z.string().optional(),

    bankAccountName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankName: z.string().optional(),

    electricity_start_index: z
      .string()
      .refine(
        (value) => !!Number(value),
        tCommon("requiredField", { field: t("form.electricity_start_index") })
      ),
    electricity_end_index: z
      .string()
      .refine(
        (value) => !!Number(value),
        tCommon("requiredField", { field: t("form.electricity_end_index") })
      ),
    water_start_index: z
      .string()
      .refine(
        (value) => !!Number(value),
        tCommon("requiredField", { field: t("form.water_start_index") })
      ),
    water_end_index: z
      .string()
      .refine(
        (value) => !!Number(value),
        tCommon("requiredField", { field: t("form.water_end_index") })
      ),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      from: new Date(),
      to: new Date(),
      houseAddress: "",
      houseOwner: "",
      houseOwnerPhoneNumber: "",
      houseOwnerBackupPhoneNumber: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankName: "",
      electricity_start_index: `${data?.electricity_start_index || 0}`,
      electricity_end_index: `${data?.electricity_end_index || 0}`,
      water_start_index: `${data?.water_start_index || 0}`,
      water_end_index: `${data?.water_end_index || 0}`,
      notes: "",
    },
  });

  const onSubmit = (value: z.infer<typeof schema>) => {
    const {
      from,
      to,
      houseAddress,
      houseOwner,
      bankName,
      houseOwnerPhoneNumber,
      houseOwnerBackupPhoneNumber,
      bankAccountName,
      bankAccountNumber,
      ...rest
    } = value;

    const payload: CreateBillingDto = {
      roomId,
      from: from.toISOString(),
      to: to.toISOString(),
      houseInfo: {
        houseAddress,
        houseOwner,
        houseOwnerPhoneNumber,
        houseOwnerBackupPhoneNumber,
      },
      bankInfo: {
        bankAccountName,
        bankAccountNumber,
        bankName,
      },
      ...rest,
    };

    if (data) {
      updateBill.mutate({
        id: data.id,
        ...payload,
      });
    } else {
      createBill.mutate(payload);
    }

    setIsDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["general", "houseInfo", "bankInfo", "billInfo"]}
        >
          {/* GENERAL */}
          <AccordionItem value="general">
            <AccordionTrigger className="text-lg hover:no-underline mt-0 pt-0">
              {t("sections.general")}
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2">
              <div className="grid md:grid-cols-2 gap-3 px-2">
                <DatePickerField
                  startMonth={dayjs()
                    .subtract(1, "year")
                    .startOf("year")
                    .toDate()}
                  endMonth={dayjs().add(1, "year").endOf("year").toDate()}
                  control={form.control}
                  name="from"
                  label={t("form.from")}
                  placeholder={t("form.fromPlaceholder")}
                />

                <DatePickerField
                  startMonth={dayjs()
                    .subtract(1, "year")
                    .startOf("year")
                    .toDate()}
                  endMonth={dayjs().add(1, "year").endOf("year").toDate()}
                  control={form.control}
                  name="to"
                  label={t("form.to")}
                  placeholder={t("form.toPlaceholder")}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* HOUSE INFO */}
          <AccordionItem value="houseInfo">
            <AccordionTrigger className="text-lg hover:no-underline mt-0">
              {t("sections.houseInfo")}
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2">
              <div className="grid sm:grid-cols-2 gap-3 px-2">
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
                />
                <InputField
                  control={form.control}
                  name="houseOwnerBackupPhoneNumber"
                  label={t("form.houseOwnerBackupPhoneNumber")}
                  placeholder={t("form.houseOwnerBackupPhoneNumberPlaceholder")}
                  type="number"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* BANK INFO */}
          <AccordionItem value="bankInfo">
            <AccordionTrigger className="text-lg hover:no-underline mt-0">
              {t("sections.bankInfo")}
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2">
              <div className="grid sm:grid-cols-2 gap-3 px-2">
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
            </AccordionContent>
          </AccordionItem>

          {/* BILL INFO */}
          <AccordionItem value="billInfo">
            <AccordionTrigger className="text-lg hover:no-underline mt-0">
              {t("sections.billInfo")}
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2">
              <div className="grid sm:grid-cols-2 gap-3 px-2">
                <InputField
                  control={form.control}
                  name="electricity_start_index"
                  label={t("form.electricity_start_index")}
                  placeholder={t("form.electricity_start_indexPlaceholder")}
                />
                <InputField
                  control={form.control}
                  name="electricity_end_index"
                  label={t("form.electricity_end_index")}
                  placeholder={t("form.electricity_end_indexPlaceholder")}
                />
                <InputField
                  control={form.control}
                  name="water_start_index"
                  label={t("form.water_start_index")}
                  placeholder={t("form.water_start_indexPlaceholder")}
                />
                <InputField
                  control={form.control}
                  name="water_end_index"
                  label={t("form.water_end_index")}
                  placeholder={t("form.water_end_indexPlaceholder")}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-3 pb-6 mt-6 sticky bottom-0 bg-neutral-100">
          <ButtonCancel onClick={handleCancel} />
          <ButtonSubmit
            className="flex-1"
            isPending={isPending}
            isEdit={!!data}
          />
        </div>
      </form>
    </Form>
  );
};

export default AddOrEditBillingForm;
