import { SpinIcon } from "@/components/icons";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import useTenantMutation from "@/hooks/tenants/useTenantMutation";
import { Tenant } from "@/types/tenants.type";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { FC, useState } from "react";

interface TenantDeleteButtonProps {
  data: Tenant;
  isLoading?: boolean;
}

const TenantDeleteButton: FC<TenantDeleteButtonProps> = ({
  data,
  isLoading,
}) => {
  const t = useTranslations("tenant");
  const [openConfirm, setOpenConfirm] = useState(false);
  const { deleteTenant } = useTenantMutation();

  const isPending = isLoading || deleteTenant.isPending;

  const handleDelete = async () => {
    await deleteTenant.mutateAsync(data.id);
    setOpenConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setOpenConfirm(true)}
        disabled={isPending}
        className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center gap-2">
          <Trash2 className="w-4 h-4" />
          <span>{isPending ? <SpinIcon /> : t("actions.delete")}</span>
        </div>
      </button>

      <ConfirmationDialog
        isOpen={openConfirm}
        title={t("deleteConfirmation.title")}
        description={t("deleteConfirmation.description")}
        confirmText={t("deleteConfirmation.confirm")}
        cancelText={t("deleteConfirmation.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setOpenConfirm(false)}
      />
    </>
  );
};

export default TenantDeleteButton;
