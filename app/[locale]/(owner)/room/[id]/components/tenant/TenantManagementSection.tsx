"use client";

import Pagination from "@/components/ui/pagination";
import { useGetListTenant } from "@/hooks/tenants/useGetListTenant";
import { useMasonry } from "@/hooks/useMasonry";
import { Tenant } from "@/types/tenants.type";
import { LayoutGrid, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import TenantCard from "./TenantCard";
import TenantFilter, { TenantFilterValues } from "./TenantFilter";
import TenantTable from "./TenantTable";

interface TenantManagementSectionProps {
  tenants: Tenant[];
  roomId: string;
}

type ViewMode = "card" | "table";

const TenantManagementSection: React.FC<TenantManagementSectionProps> = ({
  roomId,
}) => {
  const t = useTranslations("tenant.management");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>("card");

  // Get filters from URL
  const filters: TenantFilterValues = useMemo(() => {
    return {
      room: roomId,
      status: searchParams.get("tenant_status") || undefined,
      dateFrom: searchParams.get("tenant_date_from") || undefined,
      dateTo: searchParams.get("tenant_date_to") || undefined,
      page: Number(searchParams.get("tenant_page")) || 1,
      pageSize: 10,
    };
  }, [searchParams, roomId]);

  const pageSize = filters.pageSize || 10;
  const currentPage = filters?.page || 1;

  const { data, isFetching } = useGetListTenant(filters);
  console.log("data", data);
  const tenants = data?.data || [];

  // Update URL with new filters
  const updateFilters = (newFilters: Partial<TenantFilterValues>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update status
    if (newFilters.status) {
      params.set("tenant_status", newFilters.status);
    } else {
      params.delete("tenant_status");
    }

    // Update dateFrom
    if (newFilters.dateFrom) {
      params.set("tenant_date_from", newFilters.dateFrom);
    } else {
      params.delete("tenant_date_from");
    }

    // Update dateTo
    if (newFilters.dateTo) {
      params.set("tenant_date_to", newFilters.dateTo);
    } else {
      params.delete("tenant_date_to");
    }

    // Update pageSize
    if (newFilters.pageSize) {
      params.set("tenant_page_size", newFilters.pageSize.toString());
    } else {
      params.delete("tenant_page_size");
    }

    // Update page
    if (newFilters.page) {
      params.set("tenant_page", newFilters.page.toString());
    } else {
      params.delete("tenant_page");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Apply filters
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      // Filter by status
      if (filters.status) {
        const statusName = tenant.status?.name.toLowerCase();
        if (statusName !== filters.status.toLowerCase()) {
          return false;
        }
      }

      // Filter by date range
      if (filters.dateFrom) {
        const tenantDate = new Date(tenant.createdAt);
        const fromDate = new Date(filters.dateFrom);
        if (tenantDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const tenantDate = new Date(tenant.createdAt);
        const toDate = new Date(filters.dateTo);
        if (tenantDate > toDate) return false;
      }

      return true;
    });
  }, [tenants, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredTenants.length / pageSize);
  const paginatedTenants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredTenants.slice(startIndex, endIndex);
  }, [filteredTenants, currentPage]);

  const handleFilterApply = (newFilters: Partial<TenantFilterValues>) => {
    updateFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
    // Scroll to top of section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickFilter = (status: "all" | "active" | "inactive") => {
    updateFilters({
      ...filters,
      status: status === "all" ? undefined : status,
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value);

  // Masonry layout for card view
  const columns = useMasonry(paginatedTenants, { 0: 1, 768: 2, 1024: 3 });

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-1 bg-primary rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
            <p className="text-sm text-muted-foreground">
              {filteredTenants.length === 1
                ? t("count", { count: filteredTenants.length })
                : t("countPlural", { count: filteredTenants.length })}
              {hasActiveFilters && t("filtered")}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Status Filter */}
          <div className="hidden md:flex items-center bg-accent/50 dark:bg-accent/30 rounded-lg p-1 mr-2">
            <button
              onClick={() => handleQuickFilter("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                !filters.status
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("all")}
            </button>
            <button
              onClick={() => handleQuickFilter("active")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                filters.status === "active"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("active")}
            </button>
            <button
              onClick={() => handleQuickFilter("inactive")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                filters.status === "inactive"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("inactive")}
            </button>
          </div>

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

          {/* Filter Button */}
          <TenantFilter />
        </div>
      </div>

      {/* Tenant List */}
      {paginatedTenants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noTenantsFound")}</p>
          {hasActiveFilters && (
            <button
              onClick={() => handleFilterApply({})}
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
              {column.map((tenant) => (
                <TenantCard key={tenant.id} tenant={tenant} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <TenantTable tenants={paginatedTenants} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TenantManagementSection;
