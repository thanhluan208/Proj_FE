import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import React from "react";
import BillingPayButton from "./BillingPayButton";
import BillingAddOrEditButton from "./BillingAddOrEditButton";
import BillingDownloadFile from "./BillingDownloadFile";
import DeleteButton from "@/components/ui/delete-button";
import { Billing, BillingStatusEnum } from "@/types/billing.type";
import useBillMutation from "@/hooks/bills/useBillMutation";
import { useTranslations } from "next-intl";

interface BillingActionProps {
  data: Billing;
}

const BillingAction = ({ data }: BillingActionProps) => {
  const t = useTranslations("bill");

  const { deleteBill } = useBillMutation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex flex-col w-48 p-1">
        {data.status !== BillingStatusEnum.PAID && (
          <BillingPayButton data={data} />
        )}

        {data.status !== BillingStatusEnum.PAID && (
          <BillingAddOrEditButton data={data} />
        )}

        <BillingDownloadFile id={data.id} isBillFile />

        {data.status == BillingStatusEnum.PAID && (
          <BillingDownloadFile id={data.id} />
        )}
        {data.status !== BillingStatusEnum.PAID && (
          <DeleteButton
            action={deleteBill}
            id={data.id}
            title={t("deleteTitle")}
            description={t("deleteDescription")}
            className="justify-start"
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default BillingAction;
