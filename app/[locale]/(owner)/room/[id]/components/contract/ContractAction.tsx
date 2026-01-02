import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/ui/delete-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useContractMutation from "@/hooks/contracts/useContractMutation";
import { Contract } from "@/types/contract.type";
import { Ban, CircleCheck, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import ContractDownloadFile from "./ContractDownloadFile";

interface ContractActionProps {
  data: Contract;
}

const ContractAction = ({ data }: ContractActionProps) => {
  const t = useTranslations("contract");

  const { deleteContract, toggleContractStatus } = useContractMutation();
  const isActive = data.status?.id === 1;

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
        <ContractDownloadFile id={data.id} />
        <DeleteButton
          id={data.id}
          action={toggleContractStatus}
          title={
            isActive ? t("dialog.deactivateTitle") : t("dialog.activateTitle")
          }
          description={
            isActive
              ? t("dialog.deactivateDescription")
              : t("dialog.activateDescription")
          }
          buttonContent={
            isActive ? (
              <>
                <Ban className="w-4 h-4 mr-2" />
                {t("actions.deactivate")}
              </>
            ) : (
              <>
                <CircleCheck className="w-4 h-4 mr-2" />
                {t("actions.activate")}
              </>
            )
          }
          className={
            isActive
              ? "justify-start text-orange-600 hover:text-orange-700 focus:text-orange-700"
              : "justify-start text-green-600 hover:text-green-700 focus:text-green-700"
          }
        />
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
