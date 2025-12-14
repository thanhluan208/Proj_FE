import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import React from "react";
import ExpenseAddOrEditButton from "./ExpenseAddOrEditButton";
import DeleteButton from "@/components/ui/delete-button";
import { RoomExpense } from "@/types/rooms.type";
import useRoomMutation from "@/hooks/rooms/useRoomMutation";

interface ExpenseActionButtonProps {
  expense: RoomExpense;
}

const ExpenseActionButton = ({ expense }: ExpenseActionButtonProps) => {
  const { deleteRoomExpense } = useRoomMutation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex flex-col w-36 p-1">
        <ExpenseAddOrEditButton expense={expense} />

        <DeleteButton
          id={expense.id}
          action={deleteRoomExpense}
          title="Delete room expense"
          description="Are you sure you want to delete this room expense ?"
          className="justify-start"
        />
      </PopoverContent>
    </Popover>
  );
};

export default ExpenseActionButton;
