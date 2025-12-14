"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Upload, X, FileIcon } from "lucide-react";
import React, { type ReactNode, useCallback } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
  useFormContext,
} from "react-hook-form";
import { useDropzone, type DropzoneOptions } from "react-dropzone";

interface DropzoneFieldProps<
  FormValues extends FieldValues,
  TName extends Path<FormValues>
> {
  control: Control<FormValues, any>;
  name: TName;
  label: string;

  // Customization callbacks
  onChangeCustomize?: (files: File[]) => void;
  afterOnChange?: (files: File[]) => void;

  // File validation
  accept?: DropzoneOptions["accept"];
  maxSize?: number; // in bytes
  maxFiles?: number;
  validateFile?: (file: File) => string | null; // Return error message or null

  // Display options
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLabelInside?: boolean;
  placeholder?: string;
  showFileList?: boolean;
  disabled?: boolean;

  // Custom styling
  dropzoneClassName?: string;
  containerClassName?: string;
}

const DropzoneField = <
  FormValues extends FieldValues,
  TName extends Path<FormValues>
>({
  control,
  name,
  label,
  onChangeCustomize,
  afterOnChange,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 1,
  validateFile,
  leftIcon,
  rightIcon,
  isLabelInside,
  placeholder = "Drop files here or click to browse",
  showFileList = true,
  disabled = false,
  dropzoneClassName,
  containerClassName,
}: DropzoneFieldProps<FormValues, TName>) => {
  const form = useFormContext<FormValues>();
  const id = React.useId();
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (onChangeCustomize) {
        onChangeCustomize(acceptedFiles);
        return;
      }

      // Validate files if custom validator is provided
      if (validateFile) {
        const validFiles = acceptedFiles.filter((file) => {
          const error = validateFile(file);
          if (error) {
            form.setError(name, { type: "manual", message: error });
            return false;
          }
          return true;
        });

        if (validFiles.length === 0) return;
        acceptedFiles = validFiles;
      }

      // Get current files and append new ones (or replace based on maxFiles)
      const currentFiles = form.getValues(name) as File[] | undefined;
      let newFiles: File[];

      if (maxFiles === 1) {
        newFiles = acceptedFiles.slice(0, 1);
      } else if (currentFiles && Array.isArray(currentFiles)) {
        newFiles = [...currentFiles, ...acceptedFiles].slice(0, maxFiles);
      } else {
        newFiles = acceptedFiles.slice(0, maxFiles);
      }

      form.setValue(name, newFiles as PathValue<FormValues, TName>, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (afterOnChange) {
        afterOnChange(newFiles);
      }
    },
    [onChangeCustomize, validateFile, maxFiles, form, name, afterOnChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxSize,
    maxFiles,
    disabled,
  });

  const removeFile = useCallback(
    (index: number) => {
      const currentFiles = form.getValues(name) as File[] | undefined;
      if (!currentFiles || !Array.isArray(currentFiles)) return;

      const newFiles = currentFiles.filter((_, i) => i !== index);
      form.clearErrors(name);
      form.setValue(name, newFiles as PathValue<FormValues, TName>, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      if (afterOnChange) {
        afterOnChange(newFiles);
      }
    },
    [form, name, afterOnChange]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const files = (field.value as File[] | undefined) || [];
        const fileArray = Array.isArray(files) ? files : [];

        return (
          <FormItem
            id={id}
            className={cn("flex flex-col gap-1", containerClassName)}
          >
            {label && !isLabelInside && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="flex flex-col gap-2">
                <div
                  {...getRootProps()}
                  className={cn(
                    "relative flex items-center justify-center gap-2 overflow-hidden",
                    "border-2 border-dashed border-border transition-all duration-200",
                    "hover:border-primary focus-within:border-primary",
                    "rounded-[10px] p-6 cursor-pointer",
                    isDragActive && "border-primary bg-primary-10",
                    disabled && "cursor-not-allowed opacity-50",
                    dropzoneClassName
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-2 text-center">
                    {leftIcon || (
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                    <div className="flex flex-col gap-1">
                      {label && isLabelInside && (
                        <FormLabel className="text-base">{label}</FormLabel>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {isDragActive ? "Drop files here..." : placeholder}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {maxSize && `Max size: ${formatFileSize(maxSize)}`}
                        {maxFiles > 1 && ` • Max files: ${maxFiles}`}
                      </p>
                    </div>
                    {rightIcon}
                  </div>
                </div>

                {/* File list */}
                {showFileList && fileArray.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {fileArray.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className={cn(
                          "flex items-center justify-between gap-3 p-3",
                          "border border-border rounded-[10px]",
                          "bg-card hover:bg-accent transition-colors duration-200"
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileIcon className="h-5 w-5 text-primary shrink-0" />
                          <div className="flex flex-col min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className={cn(
                            "p-1 rounded-md shrink-0",
                            "hover:bg-destructive/10 text-muted-foreground hover:text-destructive",
                            "transition-colors duration-200"
                          )}
                          aria-label="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DropzoneField;
