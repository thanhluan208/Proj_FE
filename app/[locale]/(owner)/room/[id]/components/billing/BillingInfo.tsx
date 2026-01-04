"use client";

import CardContainer from "@/components/ui/card-container";
import Pagination from "@/components/ui/pagination";
import {
  useGetListBilling,
  useGetTotalBilling,
} from "@/hooks/bills/useGetListBill";
import { useMasonry } from "@/hooks/useMasonry";
import { useRouter } from "@/i18n/routing";
import { IGNORE_FILTERS_LIST } from "@/lib/constant";
import { SortOrder } from "@/types";
import { BillingTypeEnum, GetBillingDto } from "@/types/billing.type";
import { LayoutGrid, List } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import BillingAddOrEditButton from "./BillingAddOrEditButton";
import BillingCard from "./BillingCard";
import BillingFilter from "./BillingFilter";
import BillingTable from "./BillingTable";
import { useTranslations } from "next-intl";

interface BillingInfoProps {
  roomId: string;
  type: BillingTypeEnum;
}

type ViewMode = "card" | "table";

export const billingFilterKeys = [
  { key: "status", defaultValue: undefined },
  { key: "pageSize", defaultValue: "10" },
  { key: "page", defaultValue: "1" },
  { key: "from", defaultValue: undefined },
  { key: "to", defaultValue: undefined },
];

export const recBillFilterPrefix = "rec_bills";

const BillingInfo: React.FC<BillingInfoProps> = ({ roomId, type }) => {
  const t = useTranslations("bill");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const filters = useMemo<GetBillingDto>(() => {
    const baseFilters = billingFilterKeys.reduce(
      (prev: Record<string, string | undefined>, cur) => {
        if (!cur) return prev;
        const filterValue = searchParams.get(
          `${recBillFilterPrefix}_${cur.key}`
        );
        return {
          ...prev,
          [cur.key]: filterValue || cur.defaultValue,
        };
      },
      {
        room: roomId,
        pageSize: "10",
        type,
      }
    ) as unknown as GetBillingDto;

    const sort = searchParams.get(`${recBillFilterPrefix}_sort`);

    if (sort) {
      const [sortName, sortDirect] = sort.split(":");
      if (sortName) baseFilters.sortBy = sortName;
      if (sortDirect) baseFilters.sortOrder = sortDirect as SortOrder;
    }

    return baseFilters;
  }, [roomId, searchParams]);

  const { data } = useGetListBilling(filters);
  const { data: total } = useGetTotalBilling(filters);

  const bills = data?.data || [];

  const hasActiveFilters =
    Object.entries(filters).filter(
      ([key, value]) =>
        !["room", "type", ...IGNORE_FILTERS_LIST].includes(key) && !!value
    ).length > 0;

  // Masonry layout for card view
  const columns = useMasonry(bills, { 0: 1, 768: 2, 1024: 3 });

  return (
    <CardContainer
      name="billing"
      cardTitle={t(
        type === BillingTypeEnum.RECURRING
          ? "tabs.recurring"
          : type === BillingTypeEnum.USAGE_BASED
          ? "tabs.usageBased"
          : "tabs.merged"
      )}
      className="shadow-none"
      subTitle={
        <p className="text-sm text-muted-foreground">
          {bills.length} record
          {bills.length !== 1 ? "s" : ""}
          {hasActiveFilters && " (filtered)"}
        </p>
      }
      actions={
        <>
          {/* View Toggle */}
          <div
            id="billing-view-mode"
            className="flex items-center bg-accent/50 dark:bg-accent/30 rounded-lg p-1"
          >
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "card"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Card View"
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
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <BillingFilter id="billing-filter" />
          <BillingAddOrEditButton id="create-bill-button" className="w-fit" />
        </>
      }
    >
      {bills.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No billing records found</p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                billingFilterKeys.forEach((key) => {
                  console.log("delete", `${recBillFilterPrefix}_${key}`);
                  params.delete(`${recBillFilterPrefix}_${key.key}`);
                });
                router.replace(`${pathname}?${params.toString()}`, {
                  scroll: false,
                });
              }}
              className="mt-2 text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : viewMode === "card" ? (
        <div className="flex gap-4 items-start">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex-1 space-y-4">
              {column.map((billing, index) => (
                <BillingCard
                  key={billing.id}
                  billing={billing}
                  defaultOpen={index === 0 && colIndex === 0}
                  type={type}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <BillingTable billings={bills} type={type} />
      )}

      <Pagination total={total?.total} />
    </CardContainer>
  );
};

export default BillingInfo;
