import InputField from "@/components/common/fields/InputField";
import NumericFormatField from "@/components/common/fields/NumericFormatField";
import TextareaField from "@/components/common/fields/TextareaField";
import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
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

  const { createRoom } = useRoomMutation();
  const isPending = createRoom.isPending;

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
    size_sq_m: z.string().refine((value) => value !== "", {
      message: t("validation.sizeRequired"),
    }),
  });

  const addRoomForm = useForm<z.infer<typeof addRoomSchema>>({
    resolver: zodResolver(addRoomSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      size_sq_m: data?.size_sq_m || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof addRoomSchema>) => {
    const payload: CreateRoomDto = {
      name: data.name,
      house: houseId,
      description: data.description,
      size_sq_m: data.size_sq_m,
    };

    const response = await createRoom.mutateAsync(payload);

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
        className="flex flex-col gap-4 mt-4 w-[600px]"
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

        <NumericFormatField
          control={addRoomForm.control}
          name="size_sq_m"
          label={t("addRoom.size")}
          placeholder={t("addRoom.sizePlaceholder")}
          rightIcon={<span className="text-muted-foreground">m²</span>}
          enabledNumberToText={false}
        />

        <div className="flex pb-6 gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
            disabled={isPending}
          >
            {t("addRoom.cancel")}
          </Button>

          <Button disabled={isPending} type="submit" className="flex-1">
            {isPending ? <SpinIcon /> : t("addRoom.addButton")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddOrEditRoomForm;
