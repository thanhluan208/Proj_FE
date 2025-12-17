import { CommonTable } from "@/components/ui/common-table";
import HeaderSort from "@/components/ui/header-sort";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Billing,
  BillingStatusEnum,
  BillingTypeEnum,
} from "@/types/billing.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import { calculateTotals } from "./Billing.util";
import BillingAction from "./BillingAction";
import { recBillFilterPrefix } from "./BillingInfo";

interface BillingTableProps {
  billings: Billing[];
  type: BillingTypeEnum;
}

const BillingTable: React.FC<BillingTableProps> = ({ billings, type }) => {
  const t = useTranslations("bill");
  const tCommon = useTranslations("common");

  const getStatusConfig = (status: BillingStatusEnum) => {
    switch (status) {
      case BillingStatusEnum.PAID:
        return {
          label: t("status.paid"),
          className:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        };
      case BillingStatusEnum.PENDING_TENANT_PAYMENT:
        return {
          label: t("status.pendingPayment"),
          className:
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        };
      case BillingStatusEnum.PENDING_OWNER_REVIEW:
        return {
          label: t("status.pendingReview"),
          className:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        };
      default:
        return {
          label: t("status.unknown"),
          className:
            "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        };
    }
  };

  const columns = useMemo(() => {
    const cols: ColumnDef<Billing>[] = [
      {
        header: t("table.month"),
        accessorKey: "from",
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-medium text-foreground">
              {format(new Date(row.original.from), "MMM yyyy")}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(row.original.createdAt), "dd/MM/yyyy")}
            </div>
          </div>
        ),
        enablePinning: true,
      },
      {
        header: t("table.tenant"),
        accessorKey: "tenant",
        cell: ({ row }) => (
          <>
            {row.original.tenantContract.tenant && (
              <>
                <div className="text-sm font-medium text-foreground">
                  {row.original.tenantContract.tenant.name}
                </div>
                {row.original.tenantContract.tenant.citizenId && (
                  <div className="text-xs text-muted-foreground">
                    {row.original.tenantContract.tenant.citizenId}
                  </div>
                )}
              </>
            )}
          </>
        ),
        enablePinning: true,
      },
      {
        header: () => (
          <HeaderSort
            name="electricity_usage"
            filterPrefix={recBillFilterPrefix}
          >
            {t("table.electricity")}
          </HeaderSort>
        ),
        id: "electricity",
        cell: ({ row }) => {
          const totalFees = calculateTotals(row.original);
          const price_per_electricity_unit =
            row.original?.tenantContract?.contract?.price_per_electricity_unit;
          const isPricePerUnit = Number(price_per_electricity_unit) > 0;
          const displayCost =
            type === BillingTypeEnum.RECURRING || isPricePerUnit;
          return (
            <>
              {displayCost && (
                <div className="text-sm text-foreground">
                  {formatCurrency(totalFees.totalElectricityCost)}
                </div>
              )}
              {type === BillingTypeEnum.USAGE_BASED && (
                <div
                  className={cn(
                    "text-xs text-muted-foreground",
                    !isPricePerUnit && "text-sm text-foreground"
                  )}
                >
                  {row.original.electricity_start_index} →{" "}
                  {row.original.electricity_end_index} kWh
                </div>
              )}
            </>
          );
        },
      },
      {
        header: () => (
          <HeaderSort name="water_usage" filterPrefix={recBillFilterPrefix}>
            {t("table.water")}
          </HeaderSort>
        ),
        id: "water",
        cell: ({ row }) => {
          const totalFees = calculateTotals(row.original);
          const price_per_water_unit =
            row.original?.tenantContract?.contract?.price_per_water_unit;
          const isPricePerUnit = Number(price_per_water_unit) > 0;
          const displayCost =
            type === BillingTypeEnum.RECURRING || isPricePerUnit;
          return (
            <>
              {displayCost && (
                <div className="text-sm text-foreground">
                  {formatCurrency(totalFees.totalWaterCost)}
                </div>
              )}
              {type === BillingTypeEnum.USAGE_BASED && (
                <div
                  className={cn(
                    "text-xs text-muted-foreground",
                    !isPricePerUnit && "text-sm text-foreground"
                  )}
                >
                  {row.original.water_start_index} →{" "}
                  {row.original.water_end_index} m³
                </div>
              )}
            </>
          );
        },
      },
    ];

    if (type === BillingTypeEnum.RECURRING) {
      const recurringCols: ColumnDef<Billing>[] = [
        {
          header: t("table.living"),
          accessorKey: "tenantContract.contract.living_fee",
          cell: ({ row }) => (
            <div className="text-sm text-foreground">
              {formatCurrency(row.original.tenantContract.contract.living_fee)}
            </div>
          ),
        },
        {
          header: t("table.parking"),
          accessorKey: "tenantContract.contract.parking_fee",
          cell: ({ row }) => (
            <div className="text-sm text-foreground">
              {formatCurrency(row.original.tenantContract.contract.parking_fee)}
            </div>
          ),
        },
        {
          header: t("table.cleaning"),
          accessorKey: "tenantContract.contract.cleaning_fee",
          cell: ({ row }) => (
            <div className="text-sm text-foreground">
              {formatCurrency(
                row.original.tenantContract.contract.cleaning_fee
              )}
            </div>
          ),
        },
        {
          header: t("table.internet"),
          accessorKey: "tenantContract.contract.internet_fee",
          cell: ({ row }) => (
            <div className="text-sm text-foreground">
              {formatCurrency(
                row.original.tenantContract.contract.internet_fee
              )}
            </div>
          ),
        },
        {
          header: t("table.baseRent"),
          accessorKey: "tenantContract.contract.base_rent",
          cell: ({ row }) => (
            <div className="text-sm font-medium text-foreground">
              {formatCurrency(row.original.tenantContract.contract.base_rent)}
            </div>
          ),
        },
      ];

      recurringCols.forEach((elm) => cols.push(elm));
    }

    const generalInfo: ColumnDef<Billing>[] = [
      {
        header: t("table.total"),
        id: "total",
        cell: ({ row }) => {
          return (
            <div className="text-sm font-bold text-primary">
              {formatCurrency(row.original.total_amount)}
            </div>
          );
        },
      },
      {
        header: t("table.status"),
        accessorKey: "status",
        cell: ({ row }) => {
          const statusConfig = getStatusConfig(row.original.status);
          return (
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig.className}`}
            >
              {statusConfig.label}
            </span>
          );
        },
      },
      {
        header: t("table.paymentDate"),
        accessorKey: "payment_date",
        cell: ({ row }) => (
          <div className="text-sm text-foreground">
            {row.original.payment_date
              ? format(new Date(row.original.payment_date), "dd/MM/yyyy")
              : "-"}
          </div>
        ),
      },
      {
        header: tCommon("action"),
        accessorKey: "action",
        cell: ({ row }) => (
          <div className="text-sm text-foreground">
            <BillingAction data={row.original} />
          </div>
        ),
      },
    ];

    generalInfo.forEach((elm) => cols.push(elm));

    return cols;
  }, [t, tCommon, type]);

  return (
    <CommonTable
      columns={columns}
      data={billings}
      initialState={{ columnPinning: { left: ["from", "tenant"] } }}
    />
  );
};

export default BillingTable;
