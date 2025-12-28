import * as React from "react";
import { SelectSingleEventHandler } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CommonOption } from "@/types";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";
import CommonSelect from "./common-select";

interface DatePickerProps {
  date?: Date;
  className?: string;
  setDate: (date: Date) => void;
  disabled?: boolean;
  disabledDate?: (value: Date) => boolean;
  placeholder?: React.ReactNode;
  isError?: boolean;

  endMonth?: Date;
  startMonth?: Date;
}

export function DatePicker({
  date,
  setDate,
  className,
  disabled,
  placeholder,
  isError,
  disabledDate,
  endMonth,
  startMonth,
}: DatePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    DateTime | undefined
  >();

  const triggerRef = React.useRef<HTMLButtonElement>(null);

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
    <Popover>
      <PopoverTrigger disabled={disabled} ref={triggerRef} className="w-full">
        <div
          className={cn(
            "text-left font-normal hover:border-primary text-sm focus-within:border-primary hover:bg-transparent w-full flex border border-border rounded-lg px-4 py-2 justify-start items-center bg-transparent",
            !date && "text-muted-foreground",
            isError && "border-destructive text-destructive",
            className
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {date ? (
            selectedDateTime?.toFormat("DDD")
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 z-1000"
        style={{
          width: `${triggerRef.current?.getBoundingClientRect().width}px`,
        }}
      >
        <Calendar
          defaultMonth={
            selectedDateTime ? selectedDateTime.toJSDate() : undefined
          }
          mode="single"
          selected={selectedDateTime?.toJSDate()}
          captionLayout="dropdown"
          onSelect={handleSelect}
          classNames={{
            root: "w-full",
            month_caption: "z-10 px-10 ",
            nav: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between [&>button]:z-20 [&>button]:cursor-pointer",
          }}
          endMonth={endMonth}
          startMonth={startMonth}
          disabled={disabledDate}
          components={{
            YearsDropdown: ({
              options,
              value,
              onChange,
              disabled,
              ...rest
            }) => {
              const yearOptions = options?.map((elm) => {
                return {
                  ...elm,
                  value: String(elm.value),
                };
              });

              return (
                <CommonSelect
                  options={yearOptions as CommonOption[]}
                  value={String(value) || ""}
                  onValueChange={(value) => {
                    const event = {
                      target: {
                        value,
                      },
                    };

                    onChange && onChange(event as any);
                  }}
                  disabled={disabled}
                  className="bg-accent flex-1 text-primary  rounded-[6px] border-none"
                  contentClassname="z-100000"
                />
              );
            },
            MonthsDropdown({ options, value, onChange, disabled }) {
              const monthOptions = options?.map((elm) => {
                return {
                  ...elm,
                  value: String(elm.value),
                };
              });
              return (
                <CommonSelect
                  options={monthOptions as CommonOption[]}
                  value={String(value) || ""}
                  onValueChange={(value: string) => {
                    const event = {
                      target: {
                        value,
                      },
                    };

                    onChange && onChange(event as any);
                  }}
                  disabled={disabled}
                  className="bg-accent flex-1 text-primary  rounded-[6px] border-none"
                  contentClassname="z-100000"
                />
              );
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
