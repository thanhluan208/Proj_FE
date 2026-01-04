import CheckBoxField from "@/components/common/fields/CheckboxField";
import DatePickerField from "@/components/common/fields/DatePickerField";
import DropzoneField from "@/components/common/fields/DropzoneField";
import InputField from "@/components/common/fields/InputField";
import NumericFormatField from "@/components/common/fields/NumericFormatField";
import TextareaField from "@/components/common/fields/TextareaField";
import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useRoomMutation from "@/hooks/rooms/useRoomMutation";
import { Expense, RoomExpense } from "@/types/rooms.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

interface AddOrEditExpenseFormProps {
  setIsDialogOpen: (open: boolean) => void;
  roomId: string;
  data?: RoomExpense;
}

const AddOrEditExpenseForm: FC<AddOrEditExpenseFormProps> = ({
  setIsDialogOpen,
  roomId,
  data,
}) => {
  const t = useTranslations("expense");
  const { createRoomExpense, updateRoomExpense } = useRoomMutation();
  const isPending = createRoomExpense.isPending || updateRoomExpense.isPending;

  const expenseSchema = z.object({
    expenses: z.array(
      z.object({
        name: z.string().min(1, { message: t("validation.nameRequired") }),
        isAssetHandedOver: z.boolean().optional(),
        amount: z
          .string()
          .refine((value) => !!Number(value), t("validation.amountRequired")),
        date: z.date({ required_error: t("validation.dateRequired") }),
        notes: z.string().optional(),
        receipt: z.array(z.any()).refine((value) => {
          if (!value || isEmpty(value)) return true;

          for (let i = 0; i < value.length; i++) {
            if (!(value[i] instanceof File) && !value[i].id) return false;
          }

          return true;
        }),
      })
    ),
  });

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenses: data
        ? [
            {
              name: data.name,
              amount: String(data.amount),
              date: new Date(data.date),
              isAssetHandedOver: data.isAssetHandedOver,
              notes: data.notes || "",
              receipt: data.receipt ? [data.receipt as unknown as File] : [],
            },
          ]
        : [
            {
              name: "",
              amount: "0",
              isAssetHandedOver: false,
              notes: "",
              date: new Date(),
              receipt: [],
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "expenses",
  });

  const onSubmit = async (submitData: z.infer<typeof expenseSchema>) => {
    const payload = {
      roomId,
      expenses: submitData.expenses.map((expense) => ({
        name: expense.name,
        amount: expense.amount,
        date: expense.date.toISOString(),
        notes: expense.notes,
        isAssetHandedOver: expense.isAssetHandedOver,
        receipt: expense.receipt?.[0],
      })),
    };
    let response: any;

    if (data) {
      const payload = {
        id: data.id,
        roomId: roomId,
        name: submitData.expenses[0].name,
        amount: submitData.expenses[0].amount,
        isAssetHandedOver: submitData.expenses[0].isAssetHandedOver,
        date: submitData.expenses[0].date.toISOString(),
        notes: submitData.expenses[0].notes,
        hasFile: !!submitData.expenses[0].receipt?.[0],
        receipt:
          submitData.expenses[0].receipt?.[0] instanceof File
            ? submitData.expenses[0].receipt?.[0]
            : undefined,
      };

      response = updateRoomExpense.mutateAsync(payload);
    } else {
      response = await createRoomExpense.mutateAsync(payload);
    }

    if (response) {
      setIsDialogOpen(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsDialogOpen(false);
  };

  const handleAddExpense = () => {
    append({
      name: "",
      amount: "0",
      isAssetHandedOver: false,
      date: new Date(),
      notes: "",
      receipt: [],
    });
  };

  const handleRemoveExpense = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4"
      >
        <div className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-border rounded-lg p-4 relative"
            >
              {!data && fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-5 w-5 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveExpense(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              <div className="grid grid-cols-1 gap-4">
                <CheckBoxField
                  id={index === 0 ? "expense-form-handed-over" : undefined}
                  control={form.control}
                  name={`expenses.${index}.isAssetHandedOver`}
                  label={t("handedOver")}
                />

                <InputField
                  id={index === 0 ? "expense-form-name" : undefined}
                  control={form.control}
                  name={`expenses.${index}.name`}
                  label={t("form.name")}
                  placeholder={t("form.namePlaceholder")}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <NumericFormatField
                    id={index === 0 ? "expense-form-amount" : undefined}
                    rightIcon={<span className="text-muted-foreground">₫</span>}
                    control={form.control}
                    name={`expenses.${index}.amount`}
                    label={t("form.amount")}
                    placeholder={t("form.amountPlaceholder")}
                  />

                  <DatePickerField
                    id={index === 0 ? "expense-form-date" : undefined}
                    control={form.control}
                    name={`expenses.${index}.date`}
                    label={t("form.date")}
                    placeholder={t("form.datePlaceholder")}
                  />
                </div>

                <TextareaField
                  control={form.control}
                  name={`expenses.${index}.notes`}
                  label={t("form.notes")}
                  placeholder={t("form.notesPlaceholder")}
                  maxLength={250}
                />

                <DropzoneField
                  control={form.control}
                  name={`expenses.${index}.receipt`}
                  label="Upload receipt"
                  placeholder="Drop a file here or click to browse"
                  maxFiles={1}
                  maxSize={5 * 1024 * 1024} // 5MB
                  accept={{
                    "image/*": [".png", ".jpg", ".jpeg"],
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {!data && (
          <Button
            id="expense-form-add-multiple"
            type="button"
            variant="outline"
            onClick={handleAddExpense}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("form.addExpense")}
          </Button>
        )}

        <div className="flex gap-3 mt-6 pb-6 sticky bottom-0 bg-neutral-100">
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

export default AddOrEditExpenseForm;
