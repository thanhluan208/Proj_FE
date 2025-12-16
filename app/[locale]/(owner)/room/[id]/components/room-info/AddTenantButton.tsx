import AddOrEditTenantForm from "@/app/[locale]/(owner)/components/tenants/AddOrEditTenantForm";
import AddOrEditTenantID from "@/app/[locale]/(owner)/components/tenants/AddOrEditTenantID";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import { UserPlus } from "lucide-react";
import React, { FC, Fragment, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Tenant } from "@/types/tenants.type";

interface AddTenantButtonProps {
  houseId: string;
  roomId: string;
}

enum Tabs {
  TENANT_ID = "TENANT_ID",
  TENANT_INFO = "TENANT_INFO",
}

const AddTenantButton: FC<AddTenantButtonProps> = ({ houseId, roomId }) => {
  const t = useTranslations("tenant");
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>(Tabs.TENANT_ID);
  const [idResult, setIdResult] = useState<Tenant>();

  const tabs = [
    {
      id: Tabs.TENANT_ID,
      label: t("tabs.citizenId.label"),
      content: (
        <AddOrEditTenantID
          setIsDialogOpen={setOpen}
          roomId={roomId}
          setIdResult={setIdResult}
        />
      ),
    },
    {
      id: Tabs.TENANT_INFO,
      label: t("tabs.generalInfo.label"),
      content: (
        <AddOrEditTenantForm
          setIsDialogOpen={setOpen}
          houseId={houseId}
          roomId={roomId}
          data={idResult}
        />
      ),
    },
  ];

  useEffect(() => {
    if (idResult) {
      setCurrentTab(Tabs.TENANT_INFO);
    }
  }, [idResult]);

  return (
    <Fragment>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        size="sm"
        className="justify-start gap-2 w-full"
      >
        <UserPlus className="w-4 h-4" />
        {t("actions.addTenant")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[700px]! max-h-[90vh]! overflow-y-auto"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{t(`dialog.${currentTab}.title`)}</DialogTitle>
            <DialogDescription>
              {t(`dialog.${currentTab}.description`)}
            </DialogDescription>
          </DialogHeader>

          <DirectionAwareTabs
            tabs={tabs}
            activeTab={currentTab}
            setActiveTab={setCurrentTab}
            contentClassname="max-h-[70vh] p-0 h-[70vh] overflow-y-auto"
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default AddTenantButton;
