import AddOrEditContractForm from "@/app/[locale]/(owner)/components/contract/AddOrEditContractForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FilePlus } from "lucide-react";
import { useParams } from "next/navigation";
import { ComponentPropsWithoutRef, useState } from "react";
import { useTranslations } from "next-intl";

interface ContractAddButtonProps extends ComponentPropsWithoutRef<"div"> {
  isGhost?: boolean;
}

const ContractAddButton = ({ isGhost, className }: ContractAddButtonProps) => {
  const t = useTranslations("contract");
  const params = useParams();

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={isGhost ? "ghost" : "default"}
        size="sm"
        className={cn("justify-start gap-2 w-full", className)}
      >
        <FilePlus className="w-4 h-4" />
        {t("actions.create")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(90vw,1150px)]! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("dialog.createTitle")}</DialogTitle>
            <DialogDescription>
              {t("dialog.createDescription")}
            </DialogDescription>
          </DialogHeader>

          {open && (
            <AddOrEditContractForm
              roomId={String(params.id)}
              setIsDialogOpen={setOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractAddButton;
