import AddOrEditContractForm from "@/app/[locale]/(owner)/components/contract/AddOrEditContractForm";
import AddOrEditExpenseForm from "@/app/[locale]/(owner)/components/room-expense/AddOrEditRoomExpense";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Expense, RoomExpense } from "@/types/rooms.type";
import { BanknoteArrowDown, Edit2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

interface ExpenseAddOrEditButtonProps {
  expense?: RoomExpense;
}

const ExpenseAddOrEditButton = ({ expense }: ExpenseAddOrEditButtonProps) => {
  const params = useParams();
  const t = useTranslations("common");

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="sm"
        className="justify-start gap-2 w-full"
      >
        {expense ? (
          <Edit2 className="w-4 h-4" />
        ) : (
          <BanknoteArrowDown className="w-4 h-4 rotate-x-180" />
        )}
        {expense ? "Edit" : "Create room expense(s)"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(90vw,650px)]! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {expense ? "Edit room expense" : "Create Room Expense(s)"}
            </DialogTitle>
            <DialogDescription>
              {expense
                ? `Edit expense for ${expense.name}`
                : "Create new expense(s) to this room"}
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
