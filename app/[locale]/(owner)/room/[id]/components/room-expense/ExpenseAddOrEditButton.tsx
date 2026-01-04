import AddOrEditExpenseForm from "@/app/[locale]/(owner)/components/room-expense/AddOrEditRoomExpense";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { RoomExpense } from "@/types/rooms.type";
import { BanknoteArrowDown, Edit2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ComponentPropsWithoutRef, useState } from "react";

interface ExpenseAddOrEditButtonProps
  extends ComponentPropsWithoutRef<"button"> {
  expense?: RoomExpense;
  isGhost?: boolean;
}

const ExpenseAddOrEditButton = ({
  expense,
  isGhost,
  className,
  id,
}: ExpenseAddOrEditButtonProps) => {
  const params = useParams();
  const t = useTranslations("expense");

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        id={id}
        onClick={() => setOpen(true)}
        variant={isGhost || !!expense ? "ghost" : "default"}
        size="sm"
        className={cn("justify-start gap-2 w-full", className)}
      >
        {expense ? (
          <Edit2 className="w-4 h-4" />
        ) : (
          <BanknoteArrowDown className="w-4 h-4 rotate-x-180" />
        )}
        {expense ? t("button.edit") : t("button.create")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(90vw,650px)]! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {expense ? t("dialog.editTitle") : t("dialog.createTitle")}
            </DialogTitle>
            <DialogDescription>
              {expense
                ? t("dialog.editDescription", { name: expense.name })
                : t("dialog.createDescription")}
            </DialogDescription>
          </DialogHeader>

          {open && (
            <AddOrEditExpenseForm
              roomId={String(params.id)}
              setIsDialogOpen={setOpen}
              data={expense}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpenseAddOrEditButton;
