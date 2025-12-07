"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Filter, X } from "lucide-react";
import { PaginationParams } from "@/types";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export interface TenantFilterValues extends PaginationParams {
  room: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

const TenantFilter = ({}) => {
  const t = useTranslations("tenant.filter");
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [internalFilter, setInternalFilter] = useState({
    status: searchParams.get("tenant_status") || undefined,
    dateFrom: searchParams.get("tenant_date_from") || undefined,
    dateTo: searchParams.get("tenant_date_to") || undefined,
  });

  const handleApply = () => {
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    setIsFilterOpen(false);
  };

  const onClose = () => setIsFilterOpen(false);

  const hasActiveFilters = Object.values(internalFilter).some((value) => value);

  return (
    <>
      <button
        onClick={() => setIsFilterOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          hasActiveFilters
            ? "bg-primary text-primary-foreground"
            : "bg-accent/50 dark:bg-accent/30 text-foreground hover:bg-accent"
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">{t("button")}</span>
        {hasActiveFilters && (
          <span className="bg-primary-foreground text-primary text-xs px-1.5 py-0.5 rounded-full font-bold">
            {Object.values(internalFilter).filter((v) => v).length}
          </span>
        )}
      </button>

      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
            onClick={onClose}
          />
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card shadow-2xl z-50 animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-xl font-bold text-foreground">
                  {t("title")}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Filter Options */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("status")}
                  </label>
                  <select
                    value={internalFilter.status || ""}
                    onChange={(e) =>
                      setInternalFilter({
                        ...internalFilter,
                        status: e.target.value || undefined,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t("allStatuses")}</option>
                    <option value="active">{t("active")}</option>
                    <option value="inactive">{t("inactive")}</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("dateRange")}
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        {t("from")}
                      </label>
                      <input
                        type="date"
                        value={internalFilter.dateFrom || ""}
                        onChange={(e) =>
                          setInternalFilter({
                            ...internalFilter,
                            dateFrom: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        {t("to")}
                      </label>
                      <input
                        type="date"
                        value={internalFilter.dateTo || ""}
                        onChange={(e) =>
                          setInternalFilter({
                            ...internalFilter,
                            dateTo: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border space-y-3">
                <button
                  onClick={handleApply}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {t("apply")}
                </button>
                <button
                  onClick={handleClear}
                  className="w-full px-4 py-3 bg-accent text-foreground rounded-lg font-medium hover:bg-accent/80 transition-colors"
                >
                  {t("clear")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TenantFilter;
