import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useContractMutation from "@/hooks/contracts/useContractMutation";
import { Contract } from "@/types/contract.type";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";

interface ContractDeleteButtonProps {
  contract: Contract;
}

const ContractDeleteButton: FC<ContractDeleteButtonProps> = ({ contract }) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const { deleteContract } = useContractMutation();
  const isPending = deleteContract.isPending;

  const handleConfirm = () => {
    if (!contract.id) return;
    setOpenConfirm(false);

    setTimeout(() => {
      deleteContract.mutate(contract.id);
    }, 200);
  };

  return (
    <>
      <Button
        onClick={() => setOpenConfirm(true)}
        disabled={isPending}
        variant="ghost"
        className="text-destructive focus:text-destructive w-full hover:text-destructive"
      >
        {isPending ? (
          <SpinIcon />
        ) : (
          <>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </>
        )}
      </Button>
      <ConfirmationDialog
        isOpen={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        title="Delete contract"
        description="Are you sure you want to delete this contract?"
        onConfirm={handleConfirm}
        isLoading={isPending}
      />
    </>
  );
};

export default ContractDeleteButton;
