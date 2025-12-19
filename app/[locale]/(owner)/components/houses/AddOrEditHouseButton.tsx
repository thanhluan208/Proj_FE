import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { House } from "@/types/houses.type";
import { Edit, Plus } from "lucide-react";
import React, { Fragment } from "react";
import AddHouseForm from "./AddOrEditHouseForm";

interface AddOrEditHouseButtonProps {
  data?: House;
}

const AddOrEditHouseButton = ({ data }: AddOrEditHouseButtonProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Fragment>
      {data ? (
        <Edit
          className="w-4 h-4 cursor-pointer"
          onClick={() => setOpen(true)}
        />
      ) : (
        <Plus
          className="w-4 h-4 cursor-pointer"
          onClick={() => setOpen(true)}
        />
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new house</DialogTitle>
            <DialogDescription>Add a new house to the list</DialogDescription>
          </DialogHeader>

          {open && <AddHouseForm setOpen={setOpen} data={data} />}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default AddOrEditHouseButton;
