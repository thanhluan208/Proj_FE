"use client";

import React, { useState, useMemo } from "react";
import { Billing } from "@/types/billing.type";
import BillingCard from "./BillingCard";
import BillingTable from "./BillingTable";
import BillingFilter, { FilterValues } from "./BillingFilter";
import { useMasonry } from "@/hooks/useMasonry";
import { LayoutGrid, List, Filter } from "lucide-react";
import Pagination from "@/components/ui/pagination";

interface BillingHistorySectionProps {
  billings: Billing[];
  tenants: Array<{ id: string; name: string }>;
}

type ViewMode = "card" | "table";

const BillingHistorySection: React.FC<BillingHistorySectionProps> = ({
  billings,
  tenants,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Apply filters
  const filteredBillings = useMemo(() => {
    return billings.filter((billing) => {
      // Filter by tenant
      if (filters.tenantId && billing.tenant.id !== filters.tenantId) {
        return false;
      }

      // Filter by date range
      if (filters.dateFrom) {
        const billingDate = new Date(billing.month);
        const fromDate = new Date(filters.dateFrom);
        if (billingDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const billingDate = new Date(billing.month);
        const toDate = new Date(filters.dateTo);
        if (billingDate > toDate) return false;
      }

      return true;
    });
  }, [billings, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredBillings.length / pageSize);
  const paginatedBillings = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBillings.slice(startIndex, endIndex);
  }, [filteredBillings, currentPage]);

  const handleFilterApply = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value);

  // Masonry layout for card view
  const columns = useMasonry(paginatedBillings, { 0: 1, 768: 2, 1024: 3 });

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
              {filteredBillings.length} record
              {filteredBillings.length !== 1 ? "s" : ""}
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
      {paginatedBillings.length === 0 ? (
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
        <BillingTable billings={paginatedBillings} />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Filter Panel */}
      <BillingFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
        tenants={tenants}
      />
    </div>
  );
};

export default BillingHistorySection;
