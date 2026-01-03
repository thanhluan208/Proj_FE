"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";
import {
  Billing,
  BillingStatusEnum,
  BillingTypeEnum,
} from "@/types/billing.type";
import dayjs from "dayjs";
import {
  AlertTriangle,
  Car,
  Check,
  Clock,
  DollarSign,
  Droplets,
  Home,
  ListChecks,
  Sparkles,
  User,
  Wifi,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { calculateTotals } from "./Billing.util";
import BillingAction from "./BillingAction";

interface BillingCardProps {
  billing: Billing;
  defaultOpen?: boolean;
  type: BillingTypeEnum;
}

const BillingCard: React.FC<BillingCardProps> = ({
  billing,
  defaultOpen,
  type,
}) => {
  const t = useTranslations("bill");

  const totalFees = calculateTotals(billing);

  const pricePerWaterUnit =
    billing?.tenantContract?.contract?.price_per_water_unit;
  const pricePerElectricUnit =
    billing?.tenantContract?.contract?.price_per_electricity_unit;

  const displayTotalWaterCost =
    (Number(pricePerWaterUnit) > 0 && type === BillingTypeEnum.USAGE_BASED) ||
    (Number(pricePerWaterUnit) <= 0 && type === BillingTypeEnum.RECURRING);

  const displayTotalElectricCost =
    (Number(pricePerElectricUnit) > 0 &&
      type === BillingTypeEnum.USAGE_BASED) ||
    (Number(pricePerElectricUnit) <= 0 && type === BillingTypeEnum.RECURRING);

  const getStatusConfig = (status: BillingStatusEnum, billing: Billing) => {
    // Check if payment is overdue (more than 5 days past month)
    const dueDate =
      type === BillingTypeEnum.RECURRING
        ? dayjs(billing.from)
        : dayjs(billing.to).add(5, "day");
    const isOverdue =
      dayjs().isAfter(dueDate, "day") && status !== BillingStatusEnum.PAID;

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
    <div className="group relative">
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ? "details" : undefined}
        className={`bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden ${statusConfig.borderColor} border-2`}
      >
        <AccordionItem value="details" className="border-none">
          {/* Header Section */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${statusConfig.bgColor} rounded-lg`}>
                  <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {dayjs(
                      billing.type === BillingTypeEnum.RECURRING
                        ? billing.from
                        : billing.to
                    ).format("MMMM YYYY")}
                  </h3>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusConfig.bgColor} ${statusConfig.iconColor}`}
                  >
                    {statusConfig.label}
                  </div>
                </div>
              </div>

              <BillingAction data={billing} />
            </div>

            {/* Tenant Info */}
            {billing.tenantContract.tenant && (
              <div className="flex items-center gap-2 p-2 bg-accent/30 dark:bg-accent/20 rounded-lg mb-4">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {billing.tenantContract.tenant.name}
                  </p>
                  {billing.tenantContract.tenant.phoneNumber && (
                    <p className="text-xs text-muted-foreground truncate">
                      {billing.tenantContract.tenant.phoneNumber}
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

            {/* Expandable Details */}
            <AccordionContent>
              <div className="pt-4 border-t border-border mt-4">
                {/* Utility Usage */}
                <div className="space-y-2 mb-4">
                  {!!totalFees.totalElectricityCost && (
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
                              billing.tenantContract.contract
                                .fixed_electricity_fee
                            ) > 0 && (
                              <TooltipContent>
                                <p>{t("utilities.fixedElectricityPrice")}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>

                          {billing.type === BillingTypeEnum.USAGE_BASED && (
                            <p className="text-sm font-medium text-foreground">
                              {billing.electricity_start_index} →{" "}
                              {billing.electricity_end_index} kWh
                            </p>
                          )}
                        </div>
                      </div>
                      {displayTotalElectricCost && (
                        <p className="font-semibold text-foreground text-sm">
                          {formatCurrency(totalFees.totalElectricityCost)}
                        </p>
                      )}
                    </div>
                  )}
                  {!!totalFees.totalWaterCost && (
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

                            {Number(
                              billing.tenantContract.contract.fixed_water_fee
                            ) > 0 && (
                              <TooltipContent>
                                <p>{t("utilities.fixedWaterPrice")}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                          {billing.type === BillingTypeEnum.USAGE_BASED && (
                            <p className="text-sm font-medium text-foreground">
                              {billing.water_start_index} →{" "}
                              {billing.water_end_index} m³
                            </p>
                          )}
                        </div>
                      </div>
                      {displayTotalWaterCost && (
                        <p className="font-semibold text-foreground text-sm">
                          {formatCurrency(totalFees.totalWaterCost)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Other Costs */}
                {billing.type === BillingTypeEnum.RECURRING && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-background/50 dark:bg-background/30 rounded-lg">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Home className="w-3.5 h-3.5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {t("fees.living")}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {formatCurrency(
                          billing.tenantContract.contract.living_fee
                        )}
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
                        {formatCurrency(
                          billing.tenantContract.contract.parking_fee
                        )}
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
                        {formatCurrency(
                          billing.tenantContract.contract.cleaning_fee
                        )}
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
                        {formatCurrency(
                          billing.tenantContract.contract.internet_fee
                        )}
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
                        {formatCurrency(
                          billing.tenantContract.contract.base_rent
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Date */}
                {billing.payment_date && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {t("paidOn", {
                        date: dayjs(billing.payment_date).format("dd/MM/YYYY"),
                      })}
                    </span>
                  </div>
                )}
              </div>
            </AccordionContent>

            <div className="pt-2 flex justify-center">
              <AccordionTrigger className="pt-2 pb-0 hover:no-underline text-xs text-muted-foreground hover:text-primary transition-colors">
                <span className="mr-1">View Details</span>
              </AccordionTrigger>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default BillingCard;
