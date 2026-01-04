import AddOrEditBillingForm from "@/app/[locale]/(owner)/components/billing/AddOrEditBillingForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Billing } from "@/types/billing.type";
import { Edit2, FilePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ComponentPropsWithoutRef, useState } from "react";

interface BillingAddOrEditButtonProps
  extends ComponentPropsWithoutRef<"button"> {
  data?: Billing;
  isGhost?: boolean;
}

const BillingAddOrEditButton = ({
  data,
  isGhost,
  className,
  ...props
}: BillingAddOrEditButtonProps) => {
  const params = useParams();
  const t = useTranslations("bill");

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        {...props}
        onClick={() => setOpen(true)}
        size="sm"
        variant={data || isGhost ? "ghost" : "default"}
        className={cn("justify-start gap-2 w-full", className)}
      >
        {data ? (
          <>
            <Edit2 className="w-4 h-4 mr-2" />
            {t("actions.edit")}
          </>
        ) : (
          <>
            <FilePlus className="w-4 h-4" />
            {t("actions.create")}
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(90vw,750px)]! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {data ? t("dialog.editTitle") : t("dialog.createTitle")}
            </DialogTitle>
            <DialogDescription>
              {data
                ? t("dialog.editDescription")
                : t("dialog.createDescription")}
            </DialogDescription>
          </DialogHeader>

          {open && (
            <AddOrEditBillingForm
              roomId={String(params.id)}
              setIsDialogOpen={setOpen}
              data={data}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BillingAddOrEditButton;
