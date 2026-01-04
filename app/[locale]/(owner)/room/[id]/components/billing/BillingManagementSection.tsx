"use client";
import CardSplitTab from "@/components/ui/card-split-tab";
import { Tab } from "@/components/ui/direction-aware-tabs";
import { useTranslations } from "next-intl";
import BillingInfo from "./BillingInfo";
import { BillingTypeEnum } from "@/types/billing.type";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useTour } from "@/hooks/useTour";

interface BillingManagementSectionProps {
  roomId: string;
}

const BillingManagementSection = ({
  roomId,
}: BillingManagementSectionProps) => {
  const t = useTranslations("bill");
  const tTour = useTranslations("tour.billing");
  const { startBillingTour } = useTour("billing");

  const tabs: Tab[] = [
    {
      id: "recurring",
      label: t("tabs.recurring"),
      content: <BillingInfo roomId={roomId} type={BillingTypeEnum.RECURRING} />,
    },
    {
      id: "usage-based",
      label: t("tabs.usageBased"),
      content: (
        <BillingInfo roomId={roomId} type={BillingTypeEnum.USAGE_BASED} />
      ),
    },
    {
      id: "merged",
      label: t("tabs.merged"),
      content: <BillingInfo roomId={roomId} type={BillingTypeEnum.MERGED} />,
    },
  ];

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => startBillingTour()}
          className="gap-2 bg-background/50 backdrop-blur-sm border-dashed"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">{tTour("howToUse")}</span>
        </Button>
      </div>
      <CardSplitTab
        id="billing-tabs"
        tabs={tabs}
        containerClassname="shadow-sm"
      />
    </div>
  );
};

export default BillingManagementSection;
