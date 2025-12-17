import CardSplitTab from "@/components/ui/card-split-tab";
import { Tab } from "@/components/ui/direction-aware-tabs";
import { useTranslations } from "next-intl";
import BillingInfo from "./BillingInfo";
import { BillingTypeEnum } from "@/types/billing.type";

interface BillingManagementSectionProps {
  roomId: string;
}

const BillingManagementSection = ({
  roomId,
}: BillingManagementSectionProps) => {
  const t = useTranslations("bill");

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
  ];

  return <CardSplitTab tabs={tabs} containerClassname="shadow-sm" />;
};

export default BillingManagementSection;
