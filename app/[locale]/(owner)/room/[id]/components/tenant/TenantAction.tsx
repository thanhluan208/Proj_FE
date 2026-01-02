import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/ui/delete-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useRoomMutation from "@/hooks/rooms/useRoomMutation";
import { Tenant } from "@/types/tenants.type";
import { MoreVertical } from "lucide-react";
import TenantEditButton from "./TenantEditButton";
import useTenantMutation from "@/hooks/tenants/useTenantMutation";
import { useTranslations } from "next-intl";

interface TenantActionProps {
  tenant: Tenant;
}

const TenantAction = ({ tenant }: TenantActionProps) => {
  const t = useTranslations("tenant");
  const { deleteTenant } = useTenantMutation();

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
      <PopoverContent align="end" className="flex flex-col w-36 p-1">
        <TenantEditButton data={tenant} />

        <DeleteButton
          id={tenant.id}
          action={deleteTenant}
          title={t("deleteConfirmation.title")}
          description={t("deleteConfirmation.description")}
          className="justify-start"
        />
      </PopoverContent>
    </Popover>
  );
};

export default TenantAction;
