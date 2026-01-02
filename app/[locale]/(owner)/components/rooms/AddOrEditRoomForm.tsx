import InputField from "@/components/common/fields/InputField";
import NumericFormatField from "@/components/common/fields/NumericFormatField";
import TextareaField from "@/components/common/fields/TextareaField";
import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import ButtonCancel from "@/components/ui/button-cancel";
import ButtonSubmit from "@/components/ui/button-submit";
import { Form } from "@/components/ui/form";
import useRoomMutation from "@/hooks/rooms/useRoomMutation";
import { CreateRoomDto, Room } from "@/types/rooms.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddOrEditRoomFormProps {
  setIsDialogOpen: (open: boolean) => void;
  houseId: string;
  data?: Room;
}

const AddOrEditRoomForm: FC<AddOrEditRoomFormProps> = ({
  setIsDialogOpen,
  houseId,
  data,
}) => {
  const t = useTranslations("room");

  const { createRoom, updateRoom } = useRoomMutation();
  const isPending = createRoom.isPending || updateRoom.isPending;

  // Create localized validation schema using translation keys
  const addRoomSchema = z.object({
    name: z
      .string()
      .max(50, {
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
    description: z
      .string()
      .max(512, {
        message: t("validation.descriptionMaxLength"),
      })
      .optional(),
    size_sq_m: z.string().optional(),
    maxTenant: z.string().refine((value) => value !== "", {
      message: t("validation.maxTenant"),
    }),
  });

  const addRoomForm = useForm<z.infer<typeof addRoomSchema>>({
    resolver: zodResolver(addRoomSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      size_sq_m: data?.size_sq_m || "",
      maxTenant: String(data?.maxTenant || 2),
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof addRoomSchema>) => {
    let response: any;

    if (data?.id) {
      const payload = {
        id: data.id,
        name: values.name,
        description: values.description,
        size_sq_m: values.size_sq_m,
        maxTenant: values.maxTenant,
      };

      response = await updateRoom.mutateAsync(payload);
    } else {
      const payload: CreateRoomDto = {
        name: values.name,
        house: houseId,
        description: values.description,
        size_sq_m: values.size_sq_m,
        maxTenant: values.maxTenant,
      };

      response = await createRoom.mutateAsync(payload);
    }

    if (response.id) {
      setIsDialogOpen(false);
    }
  };

  const handleCancel = () => {
    addRoomForm.reset();
    setIsDialogOpen(false);
  };

  return (
    <Form {...addRoomForm}>
      <form
        onSubmit={addRoomForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4 w-[600px] relative"
      >
        <InputField
          control={addRoomForm.control}
          name="name"
          label={t("addRoom.name")}
          placeholder={t("addRoom.namePlaceholder")}
        />

        <TextareaField
          control={addRoomForm.control}
          name="description"
          label={t("addRoom.description")}
          placeholder={t("addRoom.descriptionPlaceholder")}
          maxLength={512}
          showCharacterCount={true}
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            control={addRoomForm.control}
            name="maxTenant"
            label={t("addRoom.maxTenant")}
            placeholder={t("addRoom.maxTenantPlaceholder")}
          />

          <NumericFormatField
            control={addRoomForm.control}
            name="size_sq_m"
            label={t("addRoom.size")}
            placeholder={t("addRoom.sizePlaceholder")}
            rightIcon={<span className="text-muted-foreground">m²</span>}
            enabledNumberToText={false}
          />
        </div>

        <div className="flex pb-6 gap-3 mt-6">
          <ButtonCancel onClick={handleCancel} />
          <ButtonSubmit
            className="flex-1"
            isPending={isPending}
            isEdit={!!data}
          />
        </div>
      </form>
    </Form>
  );
};

export default AddOrEditRoomForm;
