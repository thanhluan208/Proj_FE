"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/80",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      )}
    >
      {/* Dialog backdrop */}
      <div className="absolute inset-0" onClick={onCancel} aria-hidden="true" />

      {/* Dialog content */}
      <div
        className={cn(
          "relative z-50 w-full max-w-sm rounded-md bg-neutral-100 p-6 shadow-lg",
          "duration-200 animate-in zoom-in-95 fade-in-0"
        )}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className={cn(
            "absolute right-4 top-4 rounded-md p-1",
            "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900",
            "transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-medium leading-6 tracking-tight text-neutral-900 pr-6">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="mt-2 text-sm text-neutral-600">{description}</p>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center justify-center rounded-md px-4 py-2",
              "text-sm font-medium transition-colors",
              "border border-neutral-300 bg-transparent text-neutral-900",
              "hover:bg-neutral-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center justify-center rounded-md px-4 py-2",
              "text-sm font-medium transition-colors shadow-sm",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isDangerous
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            {isLoading ? "Loading..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
