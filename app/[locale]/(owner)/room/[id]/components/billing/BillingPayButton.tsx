import AddOrEditBillingForm from "@/app/[locale]/(owner)/components/billing/AddOrEditBillingForm";
import PayBillingForm from "@/app/[locale]/(owner)/components/billing/PayBillingForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Billing } from "@/types/billing.type";
import dayjs from "dayjs";
import { SquareCheckBig } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface BillingPayButtonProps {
  data?: Billing;
}

const BillingPayButton = ({ data }: BillingPayButtonProps) => {
  const t = useTranslations("bill");
  const [open, setOpen] = useState(false);

  if (!data) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        variant={data ? "ghost" : "default"}
        className="justify-start gap-2 w-full"
      >
        <SquareCheckBig className="w-4 h-4 mr-2" />
        {t("actions.confirmPayment")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(90vw,500px)]! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("dialog.confirmPaymentTitle")}</DialogTitle>
            <DialogDescription>
              {t("dialog.confirmPaymentDescription", {
                month: dayjs(data.from).format("MM-YYYY"),
                tenant: data.tenantContract.tenant.name,
              })}
            </DialogDescription>
          </DialogHeader>

          {open && <PayBillingForm bill={data} setIsDialogOpen={setOpen} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BillingPayButton;
