"use client";
import CardContainer from "@/components/ui/card-container";
import {
  useGetListExpense,
  useGetTotalExpense,
} from "@/hooks/rooms/useGetListRoomExpense";

import { useMasonry } from "@/hooks/useMasonry";
import { usePathname, useRouter } from "@/i18n/routing";
import { SortOrder, ViewMode } from "@/types";
import { ComparisonEnum, GetRoomExpensesDto } from "@/types/rooms.type";
import { LayoutGrid, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FC, useMemo, useState } from "react";
import ExpenseCard from "./ExpenseCard";
import ExpenseTable from "./ExpenseTable";
import ExpenseFilter from "./ExpenseFilter";
import ExpenseAddOrEditButton from "./ExpenseAddOrEditButton";
import { IGNORE_FILTERS_LIST } from "@/lib/constant";

interface ExpenseManagementSectionProps {
  roomId: string;
}

export const expenseFilterKeys = [
  { key: "from", defaultValue: undefined },
  { key: "to", defaultValue: undefined },
  { key: "search", defaultValue: undefined },
  { key: "amount", defaultValue: undefined },
  { key: "comparison", defaultValue: undefined },
  { key: "pageSize", defaultValue: "10" },
  { key: "page", defaultValue: "1" },
];
export const expenseFilterPrefix = "expenses";

const ExpenseManagementSection: FC<ExpenseManagementSectionProps> = ({
  roomId,
}) => {
  const t = useTranslations("expense");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const filters = useMemo<GetRoomExpensesDto>(() => {
    const baseFilters = expenseFilterKeys.reduce(
      (prev: Record<string, string | undefined>, cur) => {
        if (!cur) return prev;
        const filterValue = searchParams.get(
          `${expenseFilterPrefix}_${cur.key}`
        );
        return {
          ...prev,
          [cur.key]: filterValue || cur.defaultValue,
        };
      },
      {
        room: roomId,
        pageSize: "10",
      }
    );

    const obj = {
      ...baseFilters,
      page: baseFilters.page ? Number(baseFilters.page) : 1,
      pageSize: baseFilters.pageSize ? Number(baseFilters.pageSize) : 10,
      amount: baseFilters.amount ? Number(baseFilters.amount) : undefined,
      comparison: baseFilters.comparison as ComparisonEnum | undefined,
    } as GetRoomExpensesDto;

    const sort = searchParams.get(`${expenseFilterPrefix}_sort`);

    if (sort) {
      const [sortName, sortDirect] = sort.split(":");
      if (sortName) obj.sortBy = sortName;
      if (sortDirect) obj.sortOrder = sortDirect as SortOrder;
    }

    return obj;
  }, [roomId, searchParams]);

  const { data } = useGetListExpense(filters);
  const { data: totalExpenses } = useGetTotalExpense(filters);

  const expenses = data?.data || [];

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    expenseFilterKeys.forEach((key) => {
      params.delete(`${expenseFilterPrefix}_${key.key}`);
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const hasActiveFilters =
    Object.entries(filters).filter(
      ([key, value]) =>
        !["room", ...IGNORE_FILTERS_LIST].includes(key) && !!value
    ).length > 0;

  const columns = useMasonry(expenses || [], { 0: 1, 768: 2, 1024: 3 });

  return (
    <CardContainer
      name="expense"
      cardTitle={t("title")}
      subTitle={
        <>
          {totalExpenses?.total === 1
            ? t("count", { count: totalExpenses?.total })
            : t("countPlural", { count: totalExpenses?.total || "0" })}
          {hasActiveFilters && ` • ${t("filtered")}`}
        </>
      }
      actions={
        <>
          {/* View Toggle */}
          <div className="flex items-center bg-accent/50 dark:bg-accent/30 rounded-lg p-1">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "card"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={t("cardView")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={t("tableView")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Button - Placeholder */}
          <ExpenseFilter />

          <ExpenseAddOrEditButton className="w-fit" />
        </>
      }
    >
      {expenses?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noExpensesFound")}</p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-2 text-primary hover:underline"
            >
              {t("clearFilters")}
            </button>
          )}
        </div>
      ) : viewMode === "card" ? (
        <div className="flex gap-4 items-start">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex-1 space-y-4">
              {column.map((expense) => (
                <ExpenseCard expense={expense} key={expense.id} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <ExpenseTable expenses={expenses} total={totalExpenses?.total} />
      )}
    </CardContainer>
  );
};

export default ExpenseManagementSection;
