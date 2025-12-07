import AddOrEditContractForm from "@/app/[locale]/(owner)/components/contract/AddOrEditContractForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilePlus } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const ContractAddButton = () => {
  const params = useParams();

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="sm"
        className="justify-start gap-2 w-full"
      >
        <FilePlus className="w-4 h-4" />
        Create Contract
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add new contract</DialogTitle>
            <DialogDescription>
              Add a new contract to this room
            </DialogDescription>
          </DialogHeader>

          {open && (
            <AddOrEditContractForm
              roomId={String(params.id)}
              setIsDialogOpen={setOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractAddButton;
