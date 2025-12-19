"use client";

import AddOrEditRoomForm from "@/app/[locale]/(owner)/components/rooms/AddOrEditRoomForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Room } from "@/types/rooms.type";
import { Edit2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface RoomAddOrEditButtonProps {
  houseId: string;
  data?: Room;
}

const RoomAddOrEditButton = ({ houseId, data }: RoomAddOrEditButtonProps) => {
  const t = useTranslations("room");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <Button
        variant={data?.id ? "ghost" : "default"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDialogOpen(true);
        }}
      >
        {data?.id ? (
          <>
            <Edit2 className="w-3.5 h-3.5" />
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            {t("addRoom.buttonText")}
          </>
        )}
      </Button>

      <DialogContent
        className="sm:max-w-[unset] w-fit max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {data?.id ? t("editRoom.title") : t("addRoom.title")}
          </DialogTitle>
        </DialogHeader>

        <AddOrEditRoomForm
          houseId={houseId}
          setIsDialogOpen={setIsDialogOpen}
          data={data}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RoomAddOrEditButton;
