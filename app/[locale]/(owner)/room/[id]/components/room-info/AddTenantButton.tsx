import AddOrEditTenantForm from "@/app/[locale]/(owner)/components/tenants/AddOrEditTenantForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, UserPlus } from "lucide-react";
import React, { FC, Fragment } from "react";

interface AddTenantButtonProps {
  houseId: string;
  roomId: string;
}

const AddTenantButton: FC<AddTenantButtonProps> = ({ houseId, roomId }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Fragment>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        size="sm"
        className="justify-start gap-2 w-full"
      >
        <UserPlus className="w-4 h-4" />
        Add Tenant
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add new tenant</DialogTitle>
            <DialogDescription>Add a new tenant to this room</DialogDescription>
          </DialogHeader>

          {open && (
            <AddOrEditTenantForm
              setIsDialogOpen={setOpen}
              houseId={houseId}
              roomId={roomId}
            />
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default AddTenantButton;
