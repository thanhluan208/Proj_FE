import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import React, { Fragment } from "react";
import AddHouseForm from "./AddHouseForm";

const AddHouseButton = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Fragment>
      <Plus className="w-4 h-4 cursor-pointer" onClick={() => setOpen(true)} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>Add new house</DialogTitle>
            <DialogDescription>Add a new house to the list</DialogDescription>
          </DialogHeader>

          {open && <AddHouseForm setOpen={setOpen} />}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default AddHouseButton;
