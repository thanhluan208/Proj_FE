"use client";

import { useGetHouse } from "@/hooks/houses/useGetListHouse";
import { formatCurrency } from "@/lib/utils";
import useUserStore from "@/stores/user-profile.store";
import { House } from "@/types/houses.type";
import { Banknote, Building, DoorOpen, PieChart } from "lucide-react";
import { useTranslations } from "next-intl";
import { ActivityFeed } from "./components/dashboard/ActivityFeed";
import { MOCK_ACTIVITIES, MOCK_STATS } from "./components/dashboard/mock-data";
import { PropertyOverview } from "./components/dashboard/PropertyOverview";
import { StatsCard } from "./components/dashboard/StatsCard";
import { PropertySummary } from "./components/dashboard/types";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { profile } = useUserStore();
  const userName = profile?.fullName || "Owner";

  const { data: housesResponse } = useGetHouse();
  const houses = housesResponse?.data || [];

  const properties: PropertySummary[] = houses.map((house: House) => ({
    ...house,
    totalRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
  }));

  return (
    <div className="flex-1 space-y-8 px-4 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("welcome", { name: userName })}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("stats.totalProperties")}
          value={MOCK_STATS.totalProperties}
          icon={Building}
          description={`+1 ${t("stats.properties")} from last month`}
        />
        <StatsCard
          title={t("stats.totalUnits")}
          value={MOCK_STATS.totalUnits}
          icon={DoorOpen}
          description={`+3 ${t("stats.units")} from last month`}
        />
        <StatsCard
          title={t("stats.occupancyRate")}
          value={`${MOCK_STATS.occupancyRate}%`}
          icon={PieChart}
          description={`${MOCK_STATS.activeContracts} ${t(
            "stats.activeContracts"
          )}`}
        />
        <StatsCard
          title={t("stats.monthlyRevenue")}
          value={formatCurrency(MOCK_STATS.monthlyRevenue)}
          icon={Banknote}
          description="Total projected revenue"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <PropertyOverview properties={properties} />
        <ActivityFeed activities={MOCK_ACTIVITIES} />
      </div>
    </div>
  );
}
