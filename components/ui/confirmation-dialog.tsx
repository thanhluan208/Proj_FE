"use client";

import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { SpinIcon } from "../icons";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  content?: ReactNode;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  content,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmationDialogProps) {
  const t = useTranslations("common");

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter className="flex gap-3 mt-6 sticky bottom-0 pb-5 bg-neutral-100 ">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText || t("cancel")}
          </Button>

          <Button disabled={isLoading} onClick={onConfirm} className="flex-1">
            {isLoading ? (
              <SpinIcon />
            ) : confirmText ? (
              confirmText
            ) : (
              t("confirm")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
