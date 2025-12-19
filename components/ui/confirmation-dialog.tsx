"use client";

import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
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
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./form";
import InputField from "../common/fields/InputField";

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
  enableConfirmText?: boolean;
}

const CONFIRM_CHECK = "CONFIRM";

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
  enableConfirmText,
}: ConfirmationDialogProps) {
  const t = useTranslations("common");
  const schema = z.object({
    confirm: z.string().refine(
      (value) => {
        if (enableConfirmText) {
          console.log("VALIDATING");
          return value === CONFIRM_CHECK;
        } else return true;
      },
      {
        message: "Type confirm to process delete",
      }
    ),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      confirm: "",
    },
  });

  const confirmValue = form.watch("confirm");

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onConfirm)}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {content}

            {enableConfirmText && (
              <div className="mt-5">
                <InputField
                  label={
                    <p>
                      Type <strong>"CONFIRM"</strong> to process delete
                    </p>
                  }
                  control={form.control}
                  name="confirm"
                />
              </div>
            )}

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

              <Button
                disabled={isLoading || (enableConfirmText && !confirmValue)}
                type="submit"
                className="flex-1"
              >
                {isLoading ? (
                  <SpinIcon />
                ) : confirmText ? (
                  confirmText
                ) : (
                  t("confirm")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
