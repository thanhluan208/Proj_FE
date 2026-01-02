import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import useContractMutation from "@/hooks/contracts/useContractMutation";
import { FileDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface ContractDownloadFileProps {
  id: string;
}

const ContractDownloadFile = ({ id }: ContractDownloadFileProps) => {
  const t = useTranslations("contract");
  const { downloadContract } = useContractMutation();
  const isPending = downloadContract.isPending;

  const handleClick = async () => {
    if (!id) return;
    const response = await downloadContract.mutateAsync(id);

    // Get filename from Content-Disposition
    const disposition = response.headers["content-disposition"];
    let filename = "contract.docx";

    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);
      if (match?.[1]) {
        filename = match[1];
      }
    }

    // Create blob URL
    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: response.headers["content-type"],
      })
    );

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant="ghost"
      className="w-full justify-start h-auto px-2 py-1.5 text-sm"
    >
      {isPending ? (
        <SpinIcon />
      ) : (
        <>
          <FileDown className="w-4 h-4 mr-2" />
          {t("actions.download")}
        </>
      )}
    </Button>
  );
};

export default ContractDownloadFile;
