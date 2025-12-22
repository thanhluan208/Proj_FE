"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetRoomDetail } from "@/hooks/rooms/useGetRoomDetail";
import { format } from "date-fns";
import {
  Building2,
  CreditCard,
  DollarSign,
  MoreVertical,
  Receipt,
  Ruler,
  TrendingUp,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import ContractAddButton from "../contract/ContractAddButton";
import ExpenseAddOrEditButton from "../room-expense/ExpenseAddOrEditButton";
import AddTenantButton from "./AddTenantButton";
import { useTranslations } from "next-intl";
import BillingAddOrEditButton from "../billing/BillingAddOrEditButton";

const RoomInfoSection = () => {
  const params = useParams();
  const t = useTranslations("room");

  const { data: room } = useGetRoomDetail(params.id as string);

  if (!room) {
    return (
      <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm  animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-1 bg-muted rounded-full" />
          <div className="h-8 w-48 bg-muted rounded" />
        </div>

        {/* Main Info Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="h-10 w-64 bg-muted rounded mb-2" />
              <div className="h-4 w-48 bg-muted rounded" />
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(value));
  };

  const stats = [
    {
      icon: Users,
      label: t("info.stats.totalTenants"),
      value: room.totalTenants?.toString(),
      bgColor: "bg-secondary-10 dark:bg-neutral-800",
      iconColor: "text-secondary",
    },
    {
      icon: TrendingUp,
      label: t("info.stats.totalIncome"),
      value: formatCurrency(room.totalIncome),
      bgColor: "bg-primary-10 dark:bg-neutral-800",
      iconColor: "text-primary",
    },
    {
      icon: DollarSign,
      label: t("info.stats.totalExpenses"),
      value: formatCurrency(room.totalExpenses),
      bgColor: "bg-warning/10 dark:bg-neutral-800",
      iconColor: "text-warning",
    },
    {
      icon: CreditCard,
      label: t("info.stats.lastPayment"),
      value: room.paymentDate
        ? format(new Date(room.paymentDate), "dd/MM/yyyy")
        : t("info.na"),
      bgColor: "bg-accent dark:bg-neutral-800",
      iconColor: "text-accent-foreground",
    },
  ];

  return (
    <div className="bg-neutral-100 rounded-2xl p-6 md:p-8 shadow-sm border border-border">
      {/* Header with green accent */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-1 bg-primary rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">
            {t("info.title")}
          </h2>
        </div>

        {/* Actions Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="default" size="sm" className="gap-2 w-fit">
              <MoreVertical className="w-4 h-4" />
              {t("info.actions.button")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="flex flex-col gap-1">
              <BillingAddOrEditButton isGhost />
              <ExpenseAddOrEditButton isGhost />
              <ContractAddButton isGhost />
              <div className="pt-1 border-t border-border">
                <AddTenantButton isGhost roomId={room.id} />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Main Info Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Room Avatar/Icon */}
        <div className="shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Building2 className="w-12 h-12 md:w-16 md:h-16 text-secondary" />
          </div>
        </div>

        {/* Room Information */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-1">
              {room.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("info.created")}:{" "}
              {format(new Date(room.createdAt), "dd MMM yyyy")} •{" "}
              {t("info.updated")}:{" "}
              {format(new Date(room.updatedAt), "dd MMM yyyy")}
            </p>
          </div>

          {/* Owner, House, and Address in one line */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t("info.size")}:</span>
              <span className="font-semibold text-foreground">
                {room?.size_sq_m ?? t("info.na")} m²
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t("info.house")}:</span>
              <span className="font-semibold text-foreground">
                {room.house.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {t("info.baseRent")}:
              </span>
              <span className="font-semibold text-foreground">
                {room.base_rent ? formatCurrency(room.base_rent) : t("info.na")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-4 transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomInfoSection;
