import InputField from "@/components/common/fields/InputField";
import NumericFormatField from "@/components/common/fields/NumericFormatField";
import TextareaField from "@/components/common/fields/TextareaField";
import { SpinIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useRoomMutation from "@/hooks/rooms/useRoomMutation";
import { CreateRoomDto } from "@/types/rooms.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddRoomFormProps {
  setIsDialogOpen: (open: boolean) => void;
  houseId: string;
}

const AddRoomForm: FC<AddRoomFormProps> = ({ setIsDialogOpen, houseId }) => {
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
    base_rent: z.string().refine((value) => value !== "", {
      message: t("validation.baseRentRequired"),
    }),
    price_per_electricity_unit: z.string().optional(),
    price_per_water_unit: z.string().optional(),
    fixed_water_fee: z.string().optional(),
    fixed_electricity_fee: z.string().optional(),
    living_fee: z.string().optional(),
    parking_fee: z.string().optional(),
    cleaning_fee: z.string().optional(),
  });

  const addRoomForm = useForm<z.infer<typeof addRoomSchema>>({
    resolver: zodResolver(addRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      size_sq_m: "",
      base_rent: "",
      price_per_electricity_unit: "0",
      price_per_water_unit: "0",
      fixed_water_fee: "0",
      fixed_electricity_fee: "0",
      living_fee: "0",
      parking_fee: "0",
      cleaning_fee: "0",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof addRoomSchema>) => {
    const payload: CreateRoomDto = {
      name: data.name,
      house: houseId,
      description: data.description,
      size_sq_m: Number(data.size_sq_m),
      base_rent: Number(data.base_rent),
      price_per_electricity_unit: data.price_per_electricity_unit
        ? Number(data.price_per_electricity_unit)
        : undefined,
      price_per_water_unit: data.price_per_water_unit
        ? Number(data.price_per_water_unit)
        : undefined,
      fixed_water_fee: data.fixed_water_fee
        ? Number(data.fixed_water_fee)
        : undefined,
      fixed_electricity_fee: data.fixed_electricity_fee
        ? Number(data.fixed_electricity_fee)
        : undefined,
      living_fee: data.living_fee ? Number(data.living_fee) : undefined,
      parking_fee: data.parking_fee ? Number(data.parking_fee) : undefined,
      cleaning_fee: data.cleaning_fee ? Number(data.cleaning_fee) : undefined,
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumericFormatField
            control={addRoomForm.control}
            name="size_sq_m"
            label={t("addRoom.size")}
            placeholder={t("addRoom.sizePlaceholder")}
            rightIcon={<span className="text-muted-foreground">m²</span>}
            enabledNumberToText={false}
          />

          <NumericFormatField
            control={addRoomForm.control}
            name="base_rent"
            label={t("addRoom.baseRent")}
            placeholder={t("addRoom.baseRentPlaceholder")}
            rightIcon={<span className="text-muted-foreground">₫</span>}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumericFormatField
            rightIcon={<span className="text-muted-foreground">₫</span>}
            control={addRoomForm.control}
            name="price_per_electricity_unit"
            label={t("addRoom.pricePerElectricityUnit")}
            placeholder={t("addRoom.pricePerElectricityUnitPlaceholder")}
          />

          <NumericFormatField
            rightIcon={<span className="text-muted-foreground">₫</span>}
            control={addRoomForm.control}
            name="fixed_electricity_fee"
            label={t("addRoom.fixedElectricityFee")}
            placeholder={t("addRoom.fixedElectricityFeePlaceholder")}
          />

          <NumericFormatField
            rightIcon={<span className="text-muted-foreground">₫</span>}
            control={addRoomForm.control}
            name="price_per_water_unit"
            label={t("addRoom.pricePerWaterUnit")}
            placeholder={t("addRoom.pricePerWaterUnitPlaceholder")}
          />

          <NumericFormatField
            rightIcon={<span className="text-muted-foreground">₫</span>}
            control={addRoomForm.control}
            name="fixed_water_fee"
            label={t("addRoom.fixedWaterFee")}
            placeholder={t("addRoom.fixedWaterFeePlaceholder")}
          />

          <NumericFormatField
            rightIcon={<span className="text-muted-foreground">₫</span>}
            control={addRoomForm.control}
            name="living_fee"
            label={t("addRoom.livingFee")}
            placeholder={t("addRoom.livingFeePlaceholder")}
          />

          <NumericFormatField
            rightIcon={<span className="text-muted-foreground">₫</span>}
            control={addRoomForm.control}
            name="parking_fee"
            label={t("addRoom.parkingFee")}
            placeholder={t("addRoom.parkingFeePlaceholder")}
          />

          <NumericFormatField
            rightIcon={<span className="text-muted-foreground">₫</span>}
            control={addRoomForm.control}
            name="cleaning_fee"
            label={t("addRoom.cleaningFee")}
            placeholder={t("addRoom.cleaningFeePlaceholder")}
          />
        </div>

        <div className="flex gap-3 mt-6">
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

export default AddRoomForm;
