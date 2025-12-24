"use client";

import { CommonTable } from "@/components/ui/common-table";
import Pagination from "@/components/ui/pagination";
import { Tenant } from "@/types/tenants.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import { tenantFilterPrefix } from "./TenantManagementSection";
import TenantAction from "./TenantAction";

interface TenantTableProps {
  tenants: Tenant[];
  total?: number;
}

const TenantTable: React.FC<TenantTableProps> = ({ tenants, total }) => {
  const t = useTranslations("tenant.table");

  const getStatusColor = (status?: { name: string; color?: string }) => {
    if (!status) return "bg-gray-500";
    const color = status.color?.toLowerCase();
    switch (color) {
      case "green":
        return "bg-green-500";
      case "red":
        return "bg-red-500";
      case "blue":
        return "bg-blue-500";
      case "yellow":
        return "bg-yellow-500";
      case "gray":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const columns: ColumnDef<Tenant>[] = useMemo(
    () => [
      {
        header: t("name"),
        accessorKey: "name",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-foreground">{row.original.name}</p>
            {row.original.sex && (
              <p className="text-xs text-muted-foreground">
                {row.original.sex}
              </p>
            )}
          </div>
        ),
      },
      {
        header: t("contact"),
        accessorKey: "phoneNumber",
        cell: ({ row }) => (
          <div className="text-sm">
            {row.original.phoneNumber && (
              <p className="text-foreground">{row.original.phoneNumber}</p>
            )}
            {row.original.address && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {row.original.address}
              </p>
            )}
          </div>
        ),
      },
      {
        header: t("citizenId"),
        accessorKey: "citizenId",
        cell: ({ row }) => (
          <p className="text-sm text-foreground">
            {row.original.citizenId || "-"}
          </p>
        ),
      },
      {
        header: t("job"),
        accessorKey: "tenantJob",
        cell: ({ row }) => (
          <div className="text-sm">
            {row.original.tenantJob && (
              <p className="text-foreground">{row.original.tenantJob}</p>
            )}
            {row.original.tenantWorkAt && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {row.original.tenantWorkAt}
              </p>
            )}
            {!row.original.tenantJob && !row.original.tenantWorkAt && (
              <p className="text-muted-foreground">-</p>
            )}
          </div>
        ),
      },
      {
        header: t("status"),
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;
          return status ? (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                status
              )}`}
            >
              {status.name}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          );
        },
      },
      {
        header: t("joinedDate"),
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <p className="text-sm text-foreground">
            {format(new Date(row.original.createdAt), "dd/MM/yyyy")}
          </p>
        ),
      },
      {
        header: t("action"),
        accessorKey: "action",
        cell: ({ row }) => (
          <div className="flex justify-center items-center">
            <TenantAction tenant={row.original} />
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="flex flex-col gap-1">
      <CommonTable columns={columns} data={tenants} />
      <Pagination prefixName={tenantFilterPrefix} total={total} />
    </div>
  );
};

export default TenantTable;
