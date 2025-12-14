"use client";
import CardContainer from "@/components/ui/card-container";
import {
  useGetListExpense,
  useGetTotalExpense,
} from "@/hooks/rooms/useGetListRoomExpense";

import { useMasonry } from "@/hooks/useMasonry";
import { usePathname, useRouter } from "@/i18n/routing";
import { ViewMode } from "@/types";
import { ComparisonEnum, GetRoomExpensesDto } from "@/types/rooms.type";
import { LayoutGrid, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FC, useMemo, useState } from "react";
import ExpenseCard from "./ExpenseCard";
import ExpenseTable from "./ExpenseTable";
import ExpenseFilter from "./ExpenseFilter";
import ExpenseAddOrEditButton from "./ExpenseAddOrEditButton";

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
  const [viewMode, setViewMode] = useState<ViewMode>("card");

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

    // Convert string values to proper types
    return {
      ...baseFilters,
      page: baseFilters.page ? Number(baseFilters.page) : 1,
      pageSize: baseFilters.pageSize ? Number(baseFilters.pageSize) : 10,
      amount: baseFilters.amount ? Number(baseFilters.amount) : undefined,
      comparison: baseFilters.comparison as ComparisonEnum | undefined,
    } as GetRoomExpensesDto;
  }, [roomId, searchParams]);

  console.log("filters", filters);

  const { data } = useGetListExpense(filters);
  const { data: totalExpenses } = useGetTotalExpense(filters);

  const expenses = data?.data || [];

  const updateFilters = (newFilters: Partial<GetRoomExpensesDto>) => {
    const params = new URLSearchParams(searchParams.toString());

    expenseFilterKeys.forEach((cur) => {
      const filterValue = newFilters[cur.key as keyof GetRoomExpensesDto];
      if (
        filterValue !== undefined &&
        filterValue !== null &&
        filterValue !== ""
      ) {
        params.set(`${expenseFilterKeys}_${cur.key}`, String(filterValue));
      } else {
        params.delete(`${expenseFilterKeys}_${cur.key}`);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleQuickFilter = (period: "all" | "thisMonth" | "lastMonth") => {
    const now = new Date();
    let from: string | undefined;
    let to: string | undefined;

    if (period === "thisMonth") {
      from = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
    } else if (period === "lastMonth") {
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString()
        .split("T")[0];
      to = new Date(now.getFullYear(), now.getMonth(), 0)
        .toISOString()
        .split("T")[0];
    }

    updateFilters({
      ...filters,
      from,
      to,
      page: 1,
    });
  };

  const handleFilterApply = (newFilters: Partial<GetRoomExpensesDto>) => {
    updateFilters({ ...newFilters, page: 1 });
  };

  const handleClearFilters = () => {
    updateFilters({
      room: roomId,
      page: 1,
      pageSize: filters.pageSize,
    });
  };

  const hasActiveFilters = !!(
    filters.from ||
    filters.to ||
    filters.search ||
    filters.amount
  );

  const columns = useMasonry(expenses || [], { 0: 1, 768: 2, 1024: 3 });

  return (
    <CardContainer
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
        <ExpenseTable expenses={expenses} />
      )}
    </CardContainer>
  );
};

export default ExpenseManagementSection;
