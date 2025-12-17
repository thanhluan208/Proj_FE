import CheckBoxField from "@/components/common/fields/CheckboxField";
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
import {
  Billing,
  BillingTypeEnum,
  CreateBillingDto,
} from "@/types/billing.type";
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

  const schema = z
    .object({
      from: z.date(),
      to: z.date(),
      notes: z.string().optional(),
      isUsageBase: z.boolean(),
      electricity_start_index: z.string().optional(),
      electricity_end_index: z.string().optional(),
      water_start_index: z.string().optional(),
      water_end_index: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.isUsageBase) {
        if (!Number(data.electricity_start_index)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: tCommon("requiredField", {
              field: t("form.electricity_start_index"),
            }),
            path: ["electricity_start_index"],
          });
        }
        if (!Number(data.electricity_end_index)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: tCommon("requiredField", {
              field: t("form.electricity_end_index"),
            }),
            path: ["electricity_end_index"],
          });
        }
        if (!Number(data.water_start_index)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: tCommon("requiredField", {
              field: t("form.water_start_index"),
            }),
            path: ["water_start_index"],
          });
        }
        if (!Number(data.water_end_index)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: tCommon("requiredField", {
              field: t("form.water_end_index"),
            }),
            path: ["water_end_index"],
          });
        }
      }
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      from: data ? dayjs(data.from).toDate() : new Date(),
      to: data ? dayjs(data.to).toDate() : new Date(),
      electricity_start_index: `${data?.electricity_start_index || 0}`,
      electricity_end_index: `${data?.electricity_end_index || 0}`,
      water_start_index: `${data?.water_start_index || 0}`,
      water_end_index: `${data?.water_end_index || 0}`,
      notes: "",
      isUsageBase: data ? data.type === BillingTypeEnum.USAGE_BASED : true,
    },
  });

  const isUsageBase = form.watch("isUsageBase");

  const onSubmit = (value: z.infer<typeof schema>) => {
    const { from, to, isUsageBase, ...rest } = value;

    const payload: CreateBillingDto = {
      roomId,
      from: from.toISOString(),
      to: to.toISOString(),
      type: isUsageBase
        ? BillingTypeEnum.USAGE_BASED
        : BillingTypeEnum.RECURRING,
      // Default to "0" to satisfy TS; validation ensures valid values if isUsageBase is true
      // and if isUsageBase is false, these are deleted below.
      electricity_start_index: rest.electricity_start_index ?? "0",
      electricity_end_index: rest.electricity_end_index ?? "0",
      water_start_index: rest.water_start_index ?? "0",
      water_end_index: rest.water_end_index ?? "0",
      notes: rest.notes,
    };

    if (!isUsageBase) {
      Object.keys(payload).forEach((key) => {
        if (key.includes("index")) delete payload[key as keyof typeof payload];
      });
    }

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

          <div className="mt-4">
            <CheckBoxField
              control={form.control}
              name="isUsageBase"
              label={t("tabs.usageBased")}
            />
          </div>
          {/* BILL INFO */}
          {isUsageBase && (
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
          )}
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
