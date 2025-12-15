import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/ui/delete-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useContractMutation from "@/hooks/contracts/useContractMutation";
import { Contract } from "@/types/contract.type";
import { MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

interface ContractActionProps {
  data: Contract;
}

const ContractAction = ({ data }: ContractActionProps) => {
  const t = useTranslations("contract");

  const { deleteContract } = useContractMutation();

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
      <PopoverContent align="end" className="flex flex-col w-48 p-1">
        {/* <DropdownMenuItem onClick={() => onEdit?.(contract)}>
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem> */}
        <DeleteButton
          id={data.id}
          action={deleteContract}
          title={t("dialog.deleteTitle")}
          description={t("dialog.deleteDescription")}
          className="justify-start"
        />
      </PopoverContent>
    </Popover>
  );
};

export default ContractAction;
