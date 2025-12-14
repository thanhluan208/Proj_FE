import { CommonTable } from "@/components/ui/common-table";
import { formatCurrency } from "@/lib/utils";
import { RoomExpense } from "@/types/rooms.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import ExpenseActionButton from "./ExpenseActionButton";

interface ExpenseTableProps {
  expenses: RoomExpense[];
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses }) => {
  const t = useTranslations("expense");
  const tCommon = useTranslations("common");

  const columns: ColumnDef<RoomExpense>[] = useMemo(
    () => [
      {
        header: t("table.date"),
        accessorKey: "date",
        cell: ({ row }) => (
          <div className="text-sm font-medium text-foreground">
            {format(new Date(row.original.date), "dd/MM/yyyy")}
          </div>
        ),
      },
      {
        header: t("table.name"),
        accessorKey: "name",
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-medium text-foreground">
              {row.original.name}
            </div>
          </div>
        ),
      },
      {
        header: t("table.amount"),
        accessorKey: "amount",
        cell: ({ row }) => (
          <div className="text-sm font-bold text-primary">
            {formatCurrency(parseFloat(row.original.amount))}
          </div>
        ),
      },
      {
        header: t("table.notes"),
        accessorKey: "notes",
        cell: ({ row }) => (
          <div>
            {row.original.notes && (
              <div className="text-xs text-muted-foreground">
                {row.original.notes}
              </div>
            )}
          </div>
        ),
      },
      {
        header: tCommon("action"),
        accessorKey: "action",
        cell: ({ row }) => (
          <div className="w-full flex justify-center">
            <ExpenseActionButton expense={row.original} />
          </div>
        ),
      },
    ],
    [t]
  );

  return <CommonTable columns={columns} data={expenses} />;
};

export default ExpenseTable;
