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
import useContractMutation from "@/hooks/contracts/useContractMutation";
import { SpinIcon } from "@/components/icons";

interface ContractAddButtonProps extends ComponentPropsWithoutRef<"div"> {
  isGhost?: boolean;
}

const ContractAddButton = ({
  isGhost,
  className,
  id,
}: ContractAddButtonProps) => {
  const t = useTranslations("contract");
  const params = useParams();
  const { createContract } = useContractMutation();
  const isPending = createContract.isPending;

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        id={id}
        onClick={() => setOpen(true)}
        variant={isGhost ? "ghost" : "default"}
        size="sm"
        className={cn("justify-start gap-2 w-full", className)}
        disabled={isPending}
      >
        <FilePlus className="w-4 h-4" />
        {t("actions.create")}
        {isPending && <SpinIcon className="h-4 w-4" />}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(60vw,750px)]! max-h-[90vh] overflow-y-auto">
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
              createContract={createContract}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractAddButton;
