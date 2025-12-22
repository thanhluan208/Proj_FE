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

interface TenantActionProps {
  tenant: Tenant;
}

const TenantAction = ({ tenant }: TenantActionProps) => {
  const { deleteRoomExpense } = useRoomMutation();

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
          action={deleteRoomExpense}
          title="Delete room expense"
          description="Are you sure you want to delete this room expense ?"
          className="justify-start"
        />
      </PopoverContent>
    </Popover>
  );
};

export default TenantAction;
