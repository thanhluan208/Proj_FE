import { formatCurrency } from "@/lib/utils";
import { getUserData } from "@/server/auth";
import { getTranslations } from "next-intl/server";
import { Banknote, Building, DoorOpen, PieChart } from "lucide-react";
import { ActivityFeed } from "./components/dashboard/ActivityFeed";
import {
  MOCK_ACTIVITIES,
  MOCK_PROPERTIES,
  MOCK_STATS,
} from "./components/dashboard/mock-data";
import { PropertyOverview } from "./components/dashboard/PropertyOverview";
import { StatsCard } from "./components/dashboard/StatsCard";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const userData = await getUserData();
  const userName = userData.data?.fullName || "Owner";

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <PropertyOverview properties={MOCK_PROPERTIES} />
        <ActivityFeed activities={MOCK_ACTIVITIES} />
      </div>
    </div>
  );
}
