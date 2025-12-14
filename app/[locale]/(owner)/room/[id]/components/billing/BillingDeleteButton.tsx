import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import useBillMutation from "@/hooks/bills/useBillMutation";
import { Billing } from "@/types/billing.type";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { useTranslations } from "next-intl";

interface BillingDeleteButtonProps {
  billing: Billing;
}

const BillingDeleteButton: FC<BillingDeleteButtonProps> = ({ billing }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const t = useTranslations("bill");

  const { deleteBill } = useBillMutation();
  const isPending = deleteBill.isPending;

  const handleConfirm = () => {
    if (!billing.id) return;
    deleteBill.mutate(billing.id);

    setOpenConfirm(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpenConfirm(true)}
        disabled={isPending}
        variant="ghost"
        className="w-full justify-start text-destructive h-auto px-2 py-1.5 text-sm"
      >
        {isPending ? (
          <SpinIcon />
        ) : (
          <>
            <Trash2 className="w-4 h-4 mr-2" />
            {t("delete")}
          </>
        )}
      </Button>
      <ConfirmationDialog
        isOpen={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        onConfirm={handleConfirm}
        isLoading={isPending}
      />
    </>
  );
};

export default BillingDeleteButton;
