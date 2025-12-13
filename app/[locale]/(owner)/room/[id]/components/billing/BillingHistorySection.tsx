"use client";

import Pagination from "@/components/ui/pagination";
import {
  useGetListBilling,
  useGetTotalBilling,
} from "@/hooks/bills/useGetListBill";
import { useMasonry } from "@/hooks/useMasonry";
import { GetBillingDto } from "@/types/billing.type";
import { Filter, LayoutGrid, List } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import BillingCard from "./BillingCard";
import { FilterValues } from "./BillingFilter";
import BillingTable from "./BillingTable";
import { useRouter } from "@/i18n/routing";

interface BillingHistorySectionProps {
  roomId: string;
}

type ViewMode = "card" | "table";

const filterKeys = [
  { key: "status", defaultValue: undefined },
  { key: "pageSize", defaultValue: "10" },
  { key: "page", defaultValue: "1" },
  { key: "from", defaultValue: undefined },
  { key: "to", defaultValue: undefined },
];

const filterPrefix = "bills";

const BillingHistorySection: React.FC<BillingHistorySectionProps> = ({
  roomId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = useMemo<GetBillingDto>(() => {
    return filterKeys.reduce(
      (prev: Record<string, string | undefined>, cur) => {
        if (!cur) return prev;
        const filterValue = searchParams.get(`${filterPrefix}_${cur.key}`);
        return {
          ...prev,
          [cur.key]: filterValue || cur.defaultValue,
        };
      },
      {
        room: roomId,
        pageSize: "10",
      }
    ) as unknown as GetBillingDto;
  }, [roomId, searchParams]);

  const { data } = useGetListBilling(filters);
  const { data: total } = useGetTotalBilling(filters);

  const bills = data?.data || [];

  // Pagination
  const totalPages = total ? Math.ceil(total.total / 10) : 0;

  const handleFilterApply = (newFilters: FilterValues) => {
    // setFilters(newFilters);
    // setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    // setCurrentPage(page);
    // Scroll to top of section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value);

  // Masonry layout for card view
  const columns = useMasonry(bills, { 0: 1, 768: 2, 1024: 3 });

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-1 bg-primary rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Billing History
            </h2>
            <p className="text-sm text-muted-foreground">
              {bills.length} record
              {bills.length !== 1 ? "s" : ""}
              {hasActiveFilters && " (filtered)"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-accent/50 dark:bg-accent/30 rounded-lg p-1">
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

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              hasActiveFilters
                ? "bg-primary text-primary-foreground"
                : "bg-accent/50 dark:bg-accent/30 text-foreground hover:bg-accent"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="bg-primary-foreground text-primary text-xs px-1.5 py-0.5 rounded-full font-bold">
                {Object.values(filters).filter((v) => v).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Billing List */}
      {bills.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No billing records found</p>
          {hasActiveFilters && (
            <button
              onClick={() => handleFilterApply({})}
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
              {column.map((billing) => (
                <BillingCard key={billing.id} billing={billing} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <BillingTable billings={bills} />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={filters.page || 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Filter Panel */}
      {/* <BillingFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
        tenants={tenants}
      /> */}
    </div>
  );
};

export default BillingHistorySection;
