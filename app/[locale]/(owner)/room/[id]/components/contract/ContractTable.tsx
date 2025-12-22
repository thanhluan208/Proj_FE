import { Badge } from "@/components/ui/badge";
import { CommonTable } from "@/components/ui/common-table";
import HeaderSort from "@/components/ui/header-sort";
import Pagination from "@/components/ui/pagination";
import { formatCurrency, formatFullName } from "@/lib/utils";
import { Contract } from "@/types/contract.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AlertCircle, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import ContractAction from "./ContractAction";
import { contractFilterPrefix } from "./ContractManagementSection";

interface ContractTableProps {
  contracts: Contract[];
  total?: number;
}

const ContractTable: React.FC<ContractTableProps> = ({ contracts, total }) => {
  const t = useTranslations("contract");

  const getStatus = (contract: Contract) => {
    const now = new Date();
    const start = new Date(contract.startDate);
    const end = new Date(contract.endDate);

    if (contract.deletedAt)
      return {
        label: "Deleted",
        color: "bg-red-100 text-red-700",
        icon: Trash2,
      };
    if (now < start)
      return {
        label: "Upcoming",
        color: "bg-blue-100 text-blue-700",
        icon: Clock,
      };
    if (now > end)
      return {
        label: "Expired",
        color: "bg-gray-100 text-gray-700",
        icon: AlertCircle,
      };
    return {
      label: "Active",
      color: "bg-green-100 text-green-700",
      icon: CheckCircle2,
    };
  };

  const columns: ColumnDef<Contract>[] = useMemo(
    () => [
      {
        header: t("table.id"),
        accessorKey: "id",
        cell: ({ row }) => (
          <div className="font-medium text-sm">
            #{row.original.id.slice(0, 8)}
          </div>
        ),
      },
      {
        header: t("table.status"),
        accessorKey: "status",
        cell: ({ row }) => {
          const status = getStatus(row.original);
          const StatusIcon = status.icon;
          return (
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
            >
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </div>
          );
        },
      },
      {
        header: () => (
          <HeaderSort name="startDate" filterPrefix={contractFilterPrefix}>
            {t("table.startDate")}
          </HeaderSort>
        ),
        accessorKey: "startDate",
        cell: ({ row }) => (
          <div className="text-sm font-medium text-foreground">
            {format(new Date(row.original.startDate), "dd/MM/yyyy")}
          </div>
        ),
      },
      {
        header: () => (
          <HeaderSort name="endDate" filterPrefix={contractFilterPrefix}>
            {t("table.endDate")}
          </HeaderSort>
        ),
        accessorKey: "endDate",
        cell: ({ row }) => (
          <div className="text-sm font-medium text-foreground">
            {format(new Date(row.original.endDate), "dd/MM/yyyy")}
          </div>
        ),
      },
      {
        header: t("table.mainTenant"),
        accessorKey: "mainTenant",
        cell: ({ row }) => {
          const mainTenant = row.original.tenantContracts?.find(
            (t) => t.isMainTenant
          )?.tenant;
          return (
            <div className="text-sm font-medium">
              {mainTenant ? formatFullName(mainTenant.name) : "N/A"}
            </div>
          );
        },
      },
      {
        header: () => (
          <HeaderSort name="base_rent" filterPrefix={contractFilterPrefix}>
            <p>{t("table.baseRent")}</p>
          </HeaderSort>
        ),
        accessorKey: "base_rent",
        cell: ({ row }) => (
          <div className="text-sm font-bold text-primary">
            {formatCurrency(row.original.base_rent)}
          </div>
        ),
      },
      {
        header: t("table.action"),
        accessorKey: "action",
        cell: ({ row }) => (
          <div className="w-full flex justify-center">
            <ContractAction data={row.original} />
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="flex flex-col gap-1">
      <CommonTable columns={columns} data={contracts} />
      <Pagination prefixName={contractFilterPrefix} total={total} />
    </div>
  );
};

export default ContractTable;
