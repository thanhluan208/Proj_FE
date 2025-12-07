"use client";

import React from "react";
import { Tenant } from "@/types/tenants.type";
import { useTranslations } from "next-intl";

interface TenantTableProps {
  tenants: Tenant[];
}

const TenantTable: React.FC<TenantTableProps> = ({ tenants }) => {
  const t = useTranslations("tenant.table");
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  return (
    <div className="overflow-x-auto max-w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              {t("name")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              {t("contact")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              {t("citizenId")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              {t("job")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              {t("status")}
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
              {t("joinedDate")}
            </th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr
              key={tenant.id}
              className="border-b border-border hover:bg-accent/50 transition-colors"
            >
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-foreground">{tenant.name}</p>
                  {tenant.sex && (
                    <p className="text-xs text-muted-foreground">
                      {tenant.sex}
                    </p>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm">
                  {tenant.phoneNumber && (
                    <p className="text-foreground">{tenant.phoneNumber}</p>
                  )}
                  {tenant.address && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {tenant.address}
                    </p>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <p className="text-sm text-foreground">
                  {tenant.citizenId || "-"}
                </p>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm">
                  {tenant.tenantJob && (
                    <p className="text-foreground">{tenant.tenantJob}</p>
                  )}
                  {tenant.tenantWorkAt && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {tenant.tenantWorkAt}
                    </p>
                  )}
                  {!tenant.tenantJob && !tenant.tenantWorkAt && (
                    <p className="text-muted-foreground">-</p>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                {tenant.status ? (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                      tenant.status
                    )}`}
                  >
                    {tenant.status.name}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </td>
              <td className="py-3 px-4">
                <p className="text-sm text-foreground">
                  {formatDate(tenant.createdAt)}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TenantTable;
