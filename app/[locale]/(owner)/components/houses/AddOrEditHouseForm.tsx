"use client";

import InputField from "@/components/common/fields/InputField";
import TextAreaField from "@/components/common/fields/TextareaField";
import ButtonCancel from "@/components/ui/button-cancel";
import ButtonSubmit from "@/components/ui/button-submit";
import { Form } from "@/components/ui/form";
import useHouseMutation from "@/hooks/houses/useHouseMutation";
import { House } from "@/types/houses.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddOrEditHouseFormProps {
  setOpen: (open: boolean) => void;
  data?: House;
}

const AddOrEditHouseForm = ({ setOpen, data }: AddOrEditHouseFormProps) => {
  // Initialize translations hook for property management context
  const t = useTranslations("property");

  const { createHouse, updateHouse } = useHouseMutation();

  const isPending = createHouse.isPending || updateHouse.isPending;

  const addHouseSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: t("validation.nameRequired"),
      })
      .max(64, {
        message: t("validation.nameMaxLength"),
      })
      .refine(
        (name) => {
          return name.trim().length > 0;
        },
        {
          message: t("validation.nameRequired"),
        }
      ),
    address: z
      .string()
      .max(512, {
        message: t("validation.descriptionMaxLength"),
      })
      .optional()
      .or(z.literal("")),
    description: z
      .string()
      .max(512, {
        message: t("validation.descriptionMaxLength"),
      })
      .optional()
      .or(z.literal("")),
  });

  const addHouseForm = useForm<z.infer<typeof addHouseSchema>>({
    resolver: zodResolver(addHouseSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      address: data?.address || "",
    },
    mode: "onChange",
  });

  const allowSubmit =
    isEmpty(addHouseForm.formState.errors) &&
    addHouseForm.formState.dirtyFields &&
    !isPending;

  // Handle form submission with error handling and loading state
  const onSubmit = async (values: z.infer<typeof addHouseSchema>) => {
    if (isPending) return;

    let response: any;

    if (data) {
      response = await updateHouse.mutateAsync({
        id: data.id,
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        address: values.address,
      });
    } else {
      response = await createHouse.mutateAsync({
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        address: values.address,
      });
    }

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
        onSubmit={addHouseForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4 "
      >
        <InputField
          control={addHouseForm.control}
          name="name"
          label={t("form.name")}
          placeholder={t("form.namePlaceholder")}
        />

        <TextAreaField
          control={addHouseForm.control}
          name="description"
          label={t("form.description")}
          placeholder={t("form.descriptionPlaceholder")}
          maxLength={512}
        />

        <TextAreaField
          control={addHouseForm.control}
          name="address"
          label={t("form.address")}
          placeholder={t("form.addressPlaceholder")}
          maxLength={512}
        />

        <div className="flex gap-3 pb-6 mt-6 ">
          <ButtonCancel onClick={handleCancel} />
          <ButtonSubmit
            className="flex-1"
            isPending={isPending}
            isEdit={!!data}
            disabled={!allowSubmit}
          />
        </div>
      </form>
    </Form>
  );
};

export default AddOrEditHouseForm;
