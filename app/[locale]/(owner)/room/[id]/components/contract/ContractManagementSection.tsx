"use client";
import CardContainer from "@/components/ui/card-container";
import {
  useGetListContract,
  useGetTotalContract,
} from "@/hooks/contracts/useGetListContract";
import { useMasonry } from "@/hooks/useMasonry";
import { usePathname, useRouter } from "@/i18n/routing";
import { ViewMode } from "@/types";
import { QueryContracts } from "@/types/contract.type";
import { LayoutGrid, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FC, useMemo, useState } from "react";
import ContractCard from "./ContractCard";
import ContractAddButton from "./ContractAddButton";
import ContractTable from "./ContractTable";
import { IGNORE_FILTERS_LIST } from "@/lib/constant";
import { useTour } from "@/hooks/useTour";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface ContractManagementSectionProps {
  roomId: string;
}

const filterKeys = [
  { key: "status", defaultValue: undefined },
  { key: "pageSize", defaultValue: "10" },
  { key: "page", defaultValue: "1" },
];
export const contractFilterPrefix = "contracts";

const ContractManagementSection: FC<ContractManagementSectionProps> = ({
  roomId,
}) => {
  const t = useTranslations("contract");
  const tTour = useTranslations("tour.contract");
  const { startContractTour } = useTour("contract");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  const filters = useMemo<QueryContracts>(() => {
    return filterKeys.reduce(
      (prev: Record<string, string | undefined>, cur) => {
        if (!cur) return prev;
        const filterValue = searchParams.get(
          `${contractFilterPrefix}_${cur.key}`
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
    ) as unknown as QueryContracts;
  }, [roomId, searchParams]);

  const { data } = useGetListContract(filters);
  const { data: totalContract } = useGetTotalContract(filters);

  const contracts = data?.data || [];

  const updateFilters = (newFilters: Partial<QueryContracts>) => {
    const params = new URLSearchParams(searchParams.toString());

    filterKeys.forEach((cur) => {
      const filterValue = newFilters[cur.key as keyof QueryContracts];
      if (filterValue) {
        params.set(`${contractFilterPrefix}_${cur.key}`, String(filterValue));
      } else {
        params.delete(`${contractFilterPrefix}_${cur.key}`);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    filterKeys.forEach((key) => {
      params.delete(`${contractFilterPrefix}_${key.key}`);
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleQuickFilter = (status: "all" | "active" | "inactive") => {
    updateFilters({
      ...filters,
      status: status === "all" ? undefined : status,
    });
  };

  const handleFilterApply = (newFilters: Partial<QueryContracts>) => {
    updateFilters(newFilters);
  };

  const hasActiveFilters =
    Object.entries(filters).filter(
      ([key, value]) =>
        !["room", ...IGNORE_FILTERS_LIST].includes(key) && !!value
    ).length > 0;

  const columns = useMasonry(contracts || [], { 0: 1, 1024: 2, 1280: 3 });

  return (
    <CardContainer
      name="contract"
      cardTitle={t("title")}
      subTitle={
        <>
          {totalContract?.total === 1
            ? t("count", { count: totalContract?.total })
            : t("countPlural", { count: "0" })}
          {hasActiveFilters && ` • ${t("filtered")}`}
        </>
      }
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => startContractTour()}
            className="gap-2 bg-background/50 backdrop-blur-sm border-dashed mr-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden lg:inline">{tTour("howToUse")}</span>
          </Button>

          {/* Quick Status Filter */}
          <div
            id="contract-status-filter"
            className="hidden md:flex items-center bg-accent/50 dark:bg-accent/30 rounded-lg p-1 mr-2"
          >
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
          <div
            id="contract-view-mode"
            className="flex items-center bg-accent/50 dark:bg-accent/30 rounded-lg p-1"
          >
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
          {/* <TenantFilter /> */}

          <ContractAddButton id="add-contract-button" className="w-fit" />
        </>
      }
    >
      {contracts?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noTenantsFound")}</p>
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
        <div className="flex gap-1 lg:gap-4 items-start">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex-1 space-y-4">
              {column.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <ContractTable contracts={contracts} total={totalContract?.total} />
      )}
    </CardContainer>
  );
};

export default ContractManagementSection;
