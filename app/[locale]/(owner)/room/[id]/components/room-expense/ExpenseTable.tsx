import { CommonTable } from "@/components/ui/common-table";
import HeaderSort from "@/components/ui/header-sort";
import Pagination from "@/components/ui/pagination";
import { formatCurrency } from "@/lib/utils";
import { RoomExpense } from "@/types/rooms.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import ExpenseActionButton from "./ExpenseActionButton";
import { expenseFilterPrefix } from "./ExpenseManagementSection";

interface ExpenseTableProps {
  expenses: RoomExpense[];
  total?: number;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, total }) => {
  const t = useTranslations("expense");
  const tCommon = useTranslations("common");

  const columns: ColumnDef<RoomExpense>[] = useMemo(
    () => [
      {
        header: () => (
          <HeaderSort name="date" filterPrefix={expenseFilterPrefix}>
            {t("table.date")}
          </HeaderSort>
        ),
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
        header: () => (
          <HeaderSort name="amount" filterPrefix={expenseFilterPrefix}>
            <p>{t("table.amount")}</p>
          </HeaderSort>
        ),
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

  return (
    <div className="flex flex-col gap-1">
      <CommonTable columns={columns} data={expenses} />
      <Pagination prefixName={expenseFilterPrefix} total={total} />
    </div>
  );
};

export default ExpenseTable;
