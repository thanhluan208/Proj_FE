import AddOrEditTenantForm from "@/app/[locale]/(owner)/components/tenants/AddOrEditTenantForm";
import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useTenantMutation from "@/hooks/tenants/useTenantMutation";
import { cn } from "@/lib/utils";
import { Tenant } from "@/types/tenants.type";
import { Edit2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { ComponentPropsWithoutRef, FC } from "react";

interface TenantEditButtonProps extends ComponentPropsWithoutRef<"button"> {
  data: Tenant;
}

const TenantEditButton: FC<TenantEditButtonProps> = ({ data, className }) => {
  const t = useTranslations("tenant");
  const tCommon = useTranslations("common");
  const params = useParams();

  const { editTenant } = useTenantMutation();
  const isPending = editTenant.isPending;

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="sm"
        disabled={isPending}
        className={cn("justify-start gap-2 w-full", className)}
      >
        {isPending ? (
          <SpinIcon className="w-4 h-4" />
        ) : (
          <Edit2 className="w-4 h-4" />
        )}
        {tCommon("edit")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[700px]! max-h-[90vh]! overflow-y-auto">
          <DialogHeader className="sticky top-0 z-10 bg-neutral-100 -mx-4 -mt-3 px-4 py-3 border-b border-border">
            <DialogTitle>
              {t("editDialog.title", { name: data.name })}
            </DialogTitle>
            <DialogDescription>
              {t("editDialog.description", { name: data.name })}
            </DialogDescription>
          </DialogHeader>

          {open && (
            <AddOrEditTenantForm
              setIsDialogOpen={setOpen}
              roomId={String(params.id)}
              data={data}
              editTenant={editTenant}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TenantEditButton;
