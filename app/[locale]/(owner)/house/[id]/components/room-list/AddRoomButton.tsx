"use client";

import AddRoomForm from "@/app/[locale]/(owner)/components/rooms/AddRoomForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface CreateRoomDto {
  name: string;
  house: string;
  description?: string;
  size_sq_m: number;
  base_rent: number;
  price_per_electricity_unit?: number;
  price_per_water_unit?: number;
  fixed_water_fee?: number;
  fixed_electricity_fee?: number;
  living_fee?: number;
  parking_fee?: number;
  cleaning_fee?: number;
}

interface AddRoomButtonProps {
  houseId: string;
  buttonText?: string;
  variant?: "default" | "outline" | "ghost";
}

const AddRoomButton = ({ houseId }: AddRoomButtonProps) => {
  const t = useTranslations("room");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDialogOpen(true);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Room
      </button>

      <DialogContent
        className="sm:max-w-[unset] w-fit max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("addRoom.title")}</DialogTitle>
        </DialogHeader>

        <AddRoomForm houseId={houseId} setIsDialogOpen={setIsDialogOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomButton;
