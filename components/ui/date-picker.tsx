import * as React from "react";
import { SelectSingleEventHandler } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";

export function DatePicker({
  date,
  setDate,
  className,
  disabled,
}: DatePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    DateTime | undefined
  >();

  const handleSelect: SelectSingleEventHandler = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected);

    setSelectedDateTime(selectedDay);
    setDate(selectedDay.toJSDate());
  };

  React.useEffect(() => {
    if (date) {
      setSelectedDateTime(DateTime.fromJSDate(date));
    }
  }, [date]);

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "justify-start border-neutral-90 h-10 text-left font-normal hover:bg-transparent",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {date ? selectedDateTime?.toFormat("DDD") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[1000]">
        <Calendar
          defaultMonth={
            selectedDateTime ? selectedDateTime.toJSDate() : undefined
          }
          mode="single"
          selected={selectedDateTime?.toJSDate()}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface DatePickerProps {
  date?: Date; // new Date()
  className?: string;
  setDate: (date: Date) => void;
  disabled?: boolean;
}
