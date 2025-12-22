"use client";

import CardContainer from "@/components/ui/card-container";
import Pagination from "@/components/ui/pagination";
import {
  useGetListTenant,
  useGetTotalTenant,
} from "@/hooks/tenants/useGetListTenant";
import { useMasonry } from "@/hooks/useMasonry";
import { LayoutGrid, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import TenantCard from "./TenantCard";
import TenantFilter, { TenantFilterValues } from "./TenantFilter";
import TenantTable from "./TenantTable";
import { ViewMode } from "@/types";
import { IGNORE_FILTERS_LIST } from "@/lib/constant";
import AddTenantButton from "../room-info/AddTenantButton";

interface TenantManagementSectionProps {
  roomId: string;
}

const filterKeys = [
  { key: "status", defaultValue: undefined },
  { key: "dateFrom", defaultValue: undefined },
  { key: "dateTo", defaultValue: undefined },
  { key: "pageSize", defaultValue: "10" },
  { key: "page", defaultValue: "1" },
  { key: "search", defaultValue: undefined },
];

export const tenantFilterPrefix = "tenant";

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
    return filterKeys.reduce(
      (prev: Record<string, string | undefined>, cur) => {
        if (!cur) return prev;
        const filterValue = searchParams.get(
          `${tenantFilterPrefix}_${cur.key}`
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
    ) as unknown as TenantFilterValues;
  }, [searchParams, roomId]);

  const { data } = useGetListTenant(filters);
  const { data: totalTenants } = useGetTotalTenant(filters);
  const tenants = data?.data || [];

  // Update URL with new filters
  const updateFilters = (newFilters: Partial<TenantFilterValues>) => {
    const params = new URLSearchParams(searchParams.toString());

    filterKeys.forEach((cur) => {
      const filterValue = newFilters[cur.key as keyof TenantFilterValues];
      if (filterValue) {
        params.set(`tenant_${cur.key}`, String(filterValue));
      } else {
        params.delete(`tenant_${cur.key}`);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterApply = (newFilters: Partial<TenantFilterValues>) => {
    updateFilters(newFilters);
  };

  const hasActiveFilters =
    Object.entries(filters).filter(
      ([key, value]) =>
        !["room", ...IGNORE_FILTERS_LIST].includes(key) && !!value
    ).length > 0;

  // Masonry layout for card view
  const columns = useMasonry(tenants, { 0: 1, 768: 2, 1280: 3 });

  return (
    <CardContainer
      name="tenant"
      defaultOpen
      cardTitle={t("title")}
      subTitle={
        <>
          {totalTenants?.total === 1
            ? t("count", { count: totalTenants?.total })
            : t("countPlural", { count: totalTenants?.total || 0 })}
          {hasActiveFilters && t("filtered")}
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

          {/* Filter Button */}
          <TenantFilter />
          <AddTenantButton roomId={roomId} className="w-fit" />
        </>
      }
    >
      {tenants.length === 0 ? (
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
        <TenantTable tenants={tenants} total={totalTenants?.total} />
      )}

      {viewMode === "card" && <Pagination total={totalTenants?.total} />}
    </CardContainer>
  );
};

export default TenantManagementSection;
