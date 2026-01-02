import DatePickerField from "@/components/common/fields/DatePickerField";
import DropzoneField from "@/components/common/fields/DropzoneField";
import ButtonCancel from "@/components/ui/button-cancel";
import ButtonSubmit from "@/components/ui/button-submit";
import { Form } from "@/components/ui/form";
import useBillMutation from "@/hooks/bills/useBillMutation";
import { Billing } from "@/types/billing.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";
import dayjs from "dayjs";
import { isArray, isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";

interface PayBillingFormProps {
  setIsDialogOpen: (open: boolean) => void;
  bill: Billing;
  payBill: UseMutationResult<Billing, any, FormData, unknown>;
}

const PayBillingForm = ({
  bill,
  setIsDialogOpen,
  payBill,
}: PayBillingFormProps) => {
  const t = useTranslations("bill");

  const isPending = payBill.isPending;

  const handleCancel = () => setIsDialogOpen(false);

  const schema = z.object({
    proof: z.array(z.instanceof(File)).optional(),
    paymentDate: z.date(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentDate: new Date(),
      proof: [],
    },
  });

  const onSubmit = async (value: z.infer<typeof schema>) => {
    if (!bill.id) return;

    const formData = new FormData();
    formData.append("id", bill.id);
    formData.append("paymentDate", value.paymentDate.toISOString());
    if (value.proof && !isEmpty(value.proof)) {
      formData.append("proof", value.proof[0]);
    }

    const response = await payBill.mutateAsync(formData);
    if (response) {
      setIsDialogOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <DatePickerField
            startMonth={dayjs().subtract(1, "year").startOf("year").toDate()}
            endMonth={dayjs().add(1, "year").endOf("year").toDate()}
            control={form.control}
            name="paymentDate"
            label={t("form.paymentDate")}
            placeholder={t("form.paymentDatePlaceholder")}
            disabledDate={(date) => {
              return dayjs(date).isBefore(bill.to);
            }}
          />

          <DropzoneField
            control={form.control}
            name="proof"
            label="Upload proof"
            placeholder="Drop a file here or click to browse"
            maxFiles={1}
            maxSize={5 * 1024 * 1024} // 5MB
            accept={{
              "image/*": [".png", ".jpg", ".jpeg"],
            }}
          />
        </div>

        <div className="flex gap-3 pb-6 mt-6 sticky bottom-0 bg-neutral-100">
          <ButtonCancel onClick={handleCancel} />
          <ButtonSubmit className="flex-1" isPending={isPending} />
        </div>
      </form>
    </Form>
  );
};

export default PayBillingForm;
