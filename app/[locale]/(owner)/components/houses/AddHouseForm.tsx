"use client";

import InputField from "@/components/common/fields/InputField";
import TextAreaField from "@/components/common/fields/TextareaField";
import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useHouseMutation from "@/hooks/houses/useHouseMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddHouseFormProps {
  setOpen: (open: boolean) => void;
}

const AddHouseForm = ({ setOpen }: AddHouseFormProps) => {
  // Initialize translations hook for property management context
  const t = useTranslations("property");

  const { createHouse } = useHouseMutation();

  const isPending = createHouse.isPending;

  // Create localized validation schema using translation keys
  const addHouseSchema = z.object({
    name: z
      .string()
      .min(1, {
        // Use localized error message for required field
        message: t("validation.nameRequired"),
      })
      .max(64, {
        // Use localized error message for maximum name length
        message: t("validation.nameMaxLength"),
      })
      .refine(
        (name) => {
          // Trim whitespace and check if the name is not empty
          return name.trim().length > 0;
        },
        {
          // Use localized error message for empty name after trimming
          message: t("validation.nameRequired"),
        }
      ),
    description: z
      .string()
      .max(512, {
        // Use localized error message for maximum description length
        message: t("validation.descriptionMaxLength"),
      })
      .optional()
      .or(z.literal("")), // Allow empty string as optional
  });

  // Initialize form with react-hook-form and zod validation
  const addHouseForm = useForm<z.infer<typeof addHouseSchema>>({
    resolver: zodResolver(addHouseSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  const allowSubmit =
    isEmpty(addHouseForm.formState.errors) &&
    addHouseForm.formState.dirtyFields &&
    !isPending;

  // Handle form submission with error handling and loading state
  const onSubmit = async (data: z.infer<typeof addHouseSchema>) => {
    if (isPending) return;
    const response = await createHouse.mutateAsync({
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
    });

    if (response.id) {
      setOpen(false);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Form {...addHouseForm}>
      <form
        className="md:w-[480px] mt-5 flex flex-col gap-5"
        onSubmit={addHouseForm.handleSubmit(onSubmit)}
      >
        {/* House name input field with localized label */}
        <InputField
          control={addHouseForm.control}
          name="name"
          label={t("addHouse.name")}
          placeholder={t("addHouse.namePlaceholder")}
          inputContainerClassName="bg-neutral-90"
        />

        {/* House description input field with localized label */}
        <TextAreaField
          control={addHouseForm.control}
          name="description"
          label={t("addHouse.description")}
          placeholder={t("addHouse.descriptionPlaceholder")}
          textareaContainerClassName="bg-neutral-90"
          maxLength={512}
        />

        {/* Form action buttons */}
        <div className="flex w-full justify-end mt-5 gap-3">
          {/* Cancel button */}
          <Button
            type="button"
            variant="outline"
            className="w-40"
            onClick={handleCancel}
            disabled={isPending}
          >
            {t("addHouse.cancel")}
          </Button>

          {/* Submit button with loading state and localized text */}
          <Button disabled={!allowSubmit} type="submit" className="w-40">
            {isPending ? <SpinIcon /> : t("addHouse.addButton")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddHouseForm;
