import ComboBoxTenant from "@/components/ui/combo-box-tenant";
import React, { FC } from "react";

interface AddOrEditContractFormProps {
  setIsDialogOpen: (open: boolean) => void;
  roomId: string;
}

const AddOrEditContractForm: FC<AddOrEditContractFormProps> = ({
  roomId,
  setIsDialogOpen,
}) => {
  return (
    <div>
      <ComboBoxTenant
        handleRemove={(id) => console.log("Remove: ", id)}
        roomId={roomId}
        handleSelect={(value) => console.log("Selected: ", value)}
      />
    </div>
  );
};

export default AddOrEditContractForm;
