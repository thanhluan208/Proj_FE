import AddOrEditTenantForm from "@/app/[locale]/(owner)/components/tenants/AddOrEditTenantForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QueryKeys } from "@/lib/constant";
import { Room } from "@/types/rooms.type";
import { Tenant } from "@/types/tenants.type";
import { useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { FC, useState } from "react";

interface TenantEditButtonProps {
  data: Tenant;
}

const TenantEditButton: FC<TenantEditButtonProps> = ({ data }) => {
  const t = useTranslations("tenant");
  const params = useParams();
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);

  const roomData = queryClient.getQueryData([
    QueryKeys.ROOM_DETAIL,
    params.id,
  ]) as Room;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1 hover:bg-accent/50 rounded-full cursor-pointer transition-colors opacity-0 invisible group-hover:opacity-100 group-hover:visible"
        aria-label={t("card.editLabel")}
      >
        <Edit className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
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
              houseId={roomData?.house?.id}
              roomId={String(params.id)}
              data={data}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TenantEditButton;
