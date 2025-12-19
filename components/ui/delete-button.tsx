import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import useContractMutation from "@/hooks/contracts/useContractMutation";
import { cn } from "@/lib/utils";
import { Contract } from "@/types/contract.type";
import { UseMutationResult } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useCallback,
  useState,
} from "react";

interface DeleteButtonProps<T> extends ComponentPropsWithoutRef<"button"> {
  id: string;
  action: UseMutationResult<T, any, string, unknown>;
  buttonContent?: ReactNode;
  title: string;
  description?: string;
  dialogContent?: ReactNode;
  enableConfirmText?: boolean;
}

const DeleteButton = <T,>({
  id,
  action,
  buttonContent,
  title,
  dialogContent,
  description,
  enableConfirmText,
  className,
}: DeleteButtonProps<T>) => {
  const t = useTranslations("common");
  const [openConfirm, setOpenConfirm] = useState(false);

  const isPending = action.isPending;

  const handleConfirm = () => {
    console.log("submit");
    if (!id) return;
    action.mutate(id, {
      onSuccess: () => setOpenConfirm(false),
    });
  };

  const renderButtonContent = useCallback(() => {
    if (isPending) return <SpinIcon />;

    if (buttonContent) return buttonContent;

    return (
      <>
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </>
    );
  }, [isPending, buttonContent]);

  return (
    <>
      <Button
        onClick={() => setOpenConfirm(true)}
        disabled={isPending}
        variant="ghost"
        className={cn(
          "text-destructive focus:text-destructive w-full hover:text-destructive",
          className
        )}
      >
        {renderButtonContent()}
      </Button>
      <ConfirmationDialog
        isOpen={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        title={title}
        description={description}
        content={dialogContent}
        onConfirm={handleConfirm}
        isLoading={isPending}
        enableConfirmText={enableConfirmText}
      />
    </>
  );
};

export default DeleteButton;
