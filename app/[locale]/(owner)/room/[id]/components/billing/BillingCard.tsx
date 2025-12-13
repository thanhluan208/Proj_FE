"use client";

import React, { useState } from "react";
import { Billing, BillingStatusEnum } from "@/types/billing.type";
import { format, isPast, addDays } from "date-fns";
import {
  User,
  Zap,
  Droplets,
  Home,
  Car,
  Sparkles,
  DollarSign,
  Clock,
  ChevronDown,
  Check,
  ListChecks,
  AlertTriangle,
  Wifi,
} from "lucide-react";
import { calculateTotals } from "./Billing.util";
import { formatCurrency } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

interface BillingCardProps {
  billing: Billing;
}

const BillingCard: React.FC<BillingCardProps> = ({ billing }) => {
  const t = useTranslations("bill");
  const [isExpanded, setIsExpanded] = useState(false);

  const totalFees = calculateTotals(billing);

  const getStatusConfig = (status: BillingStatusEnum, billing: Billing) => {
    // Check if payment is overdue (more than 5 days past month)
    const dueDate = addDays(new Date(billing.to), 5);
    const isOverdue = isPast(dueDate) && status !== BillingStatusEnum.PAID;

    if (isOverdue) {
      return {
        icon: AlertTriangle,
        label: t("status.overdue"),
        bgColor: "bg-red-50 dark:bg-red-900/20",
        iconColor: "text-red-600 dark:text-red-400",
        borderColor: "border-red-200 dark:border-red-800",
      };
    }

    switch (status) {
      case BillingStatusEnum.PAID:
        return {
          icon: Check,
          label: t("status.paid"),
          bgColor: "bg-green-50 dark:bg-green-900/20",
          iconColor: "text-green-600 dark:text-green-400",
          borderColor: "border-green-200 dark:border-green-800",
        };
      case BillingStatusEnum.PENDING_TENANT_PAYMENT:
        return {
          icon: Clock,
          label: t("status.pendingPayment"),
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          borderColor: "border-yellow-200 dark:border-yellow-800",
        };
      case BillingStatusEnum.PENDING_OWNER_REVIEW:
        return {
          icon: ListChecks,
          label: t("status.pendingReview"),
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          iconColor: "text-blue-600 dark:text-blue-400",
          borderColor: "border-blue-200 dark:border-blue-800",
        };
      default:
        return {
          icon: Clock,
          label: t("status.unknown"),
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          iconColor: "text-gray-600 dark:text-gray-400",
          borderColor: "border-gray-200 dark:border-gray-800",
        };
    }
  };

  const statusConfig = getStatusConfig(billing.status, billing);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`bg-card rounded-xl p-4 border-2 ${statusConfig.borderColor} hover:shadow-md transition-all duration-300`}
    >
      {/* Collapsed View - Always Visible */}
      <div className="space-y-3">
        {/* Header with Icon and Date */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${statusConfig.bgColor} rounded-lg`}>
              <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {format(new Date(billing.from), "MMMM yyyy")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {statusConfig.label}
              </p>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label={isExpanded ? t("collapse") : t("expand")}
          >
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Tenant Info */}
        {billing.tenant && (
          <div className="flex items-center gap-2 p-2 bg-accent/30 dark:bg-accent/20 rounded-lg">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {billing.tenant.name}
              </p>
              {billing.tenant.phoneNumber && (
                <p className="text-xs text-muted-foreground truncate">
                  {billing.tenant.phoneNumber}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Total Amount - Always Visible */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground">
            {t("total")}
          </p>
          <p className="text-lg font-bold text-primary">
            {formatCurrency(billing.total_amount)}
          </p>
        </div>
      </div>

      {/* Expanded View - Details */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 pt-3 border-t border-border">
            {/* Utility Usage */}
            <div className="space-y-2">
              <div className="flex items-end justify-between p-2 bg-background/50 dark:bg-background/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <div>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="text-xs text-muted-foreground">
                          {t("utilities.electricity")}
                        </p>
                      </TooltipTrigger>

                      {Number(
                        billing.tenantContract.contract.fixed_electricity_fee
                      ) > 0 && (
                        <TooltipContent>
                          <p>{t("utilities.fixedElectricityPrice")}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>

                    <p className="text-sm font-medium text-foreground">
                      {billing.electricity_start_index} →{" "}
                      {billing.electricity_end_index} kWh
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-foreground text-sm">
                  {formatCurrency(totalFees.totalElectricityCost)}
                </p>
              </div>

              <div className="flex items-end justify-between p-2 bg-background/50 dark:bg-background/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <div>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="text-xs text-muted-foreground">
                          {t("utilities.water")}
                        </p>
                      </TooltipTrigger>

                      {Number(billing.tenantContract.contract.fixed_water_fee) >
                        0 && (
                        <TooltipContent>
                          <p>{t("utilities.fixedWaterPrice")}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <p className="text-sm font-medium text-foreground">
                      {billing.water_start_index} → {billing.water_end_index} m³
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-foreground text-sm">
                  {formatCurrency(totalFees.totalWaterCost)}
                </p>
              </div>
            </div>

            {/* Other Costs */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-background/50 dark:bg-background/30 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <Home className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {t("fees.living")}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(billing.tenantContract.contract.living_fee)}
                </p>
              </div>

              <div className="p-2 bg-background/50 dark:bg-background/30 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <Car className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {t("fees.parking")}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(billing.tenantContract.contract.parking_fee)}
                </p>
              </div>

              <div className="p-2 bg-background/50 dark:bg-background/30 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {t("fees.cleaning")}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(billing.tenantContract.contract.cleaning_fee)}
                </p>
              </div>

              <div className="p-2 bg-background/50 dark:bg-background/30 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <Wifi className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {t("fees.internet")}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(billing.tenantContract.contract.internet_fee)}
                </p>
              </div>

              <div className="p-2 bg-background/50 dark:bg-background/30 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {t("fees.baseRent")}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatCurrency(billing.tenantContract.contract.base_rent)}
                </p>
              </div>
            </div>

            {/* Payment Date */}
            {billing.payment_date && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {t("paidOn", {
                    date: format(new Date(billing.payment_date), "dd/MM/yyyy"),
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingCard;
