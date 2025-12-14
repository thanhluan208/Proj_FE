import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import useBillMutation from "@/hooks/bills/useBillMutation";
import { FileDown } from "lucide-react";
import React from "react";

interface BillingDownloadFileProps {
  id: string;
  isBillFile?: boolean;
}

const BillingDownloadFile = ({ isBillFile, id }: BillingDownloadFileProps) => {
  const { downloadFile } = useBillMutation();
  const isPending = downloadFile.isPending;

  const handleClick = async () => {
    if (!id) return;
    const response = await downloadFile.mutateAsync({ id, isBillFile });

    // Get filename from Content-Disposition
    const disposition = response.headers["content-disposition"];
    let filename = "invoice.xlsx";

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
          {isBillFile ? "Download bill file" : "Download bill proof"}
        </>
      )}
    </Button>
  );
};

export default BillingDownloadFile;
