"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageDialogProps {
  src: string;
  alt: string;
  className?: string;
  dialogClassName?: string;
  thumbnailClassName?: string;
  imageClassName?: string;
}

export function ImageDialog({
  src,
  alt,
  className,
  dialogClassName,
  thumbnailClassName,
  imageClassName,
}: ImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative">
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          onClick={() => setIsOpen(true)}
          className={cn(
            "cursor-pointer transition-opacity rounded-lg hover:opacity-80",
            thumbnailClassName,
            className
          )}
        />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn(
            "max-w-[95vw] max-h-[95vh] border-0 bg-transparent p-0 shadow-none",
            dialogClassName
          )}
        >
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className={cn(
              "w-full h-full object-contain rounded-lg",
              imageClassName
            )}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
