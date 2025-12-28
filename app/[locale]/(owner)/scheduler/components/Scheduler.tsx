"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { usePathname, useRouter } from "@/i18n/routing";
import dayjs from "dayjs";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import isoWeek from "dayjs/plugin/isoWeek";
import MonthDay from "./MonthDay";
import { useGetListScheduler } from "@/hooks/scheduler/useGetListScheduler";
import { useSearchParams } from "next/navigation";
import { Scheduler as SchedulerType } from "@/types/scheduler.type";

dayjs.extend(isoWeek);

const Scheduler = () => {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentDateSearch = searchParams.get("date");
  const currentDate = dayjs(currentDateSearch).isValid()
    ? dayjs(currentDateSearch)
    : dayjs();

  const { data: schedulers } = useGetListScheduler({
    startDate: currentDate.startOf("month").startOf("isoWeek").toISOString(),
    endDate: currentDate.endOf("month").endOf("isoWeek").toISOString(),
  });

  const handleSelectDate = (value: Date) => {
    const search = new URLSearchParams(searchParams);
    search.set("date", dayjs(value).toString());

    router.replace(`${path}?${search.toString()}`, { scroll: false });
  };

  const handleNextMonth = () =>
    handleSelectDate(currentDate.add(1, "month").toDate());
  const handlePrevMonth = () =>
    handleSelectDate(currentDate.subtract(1, "month").toDate());

  const renderMonthDay = () => {
    const firstMonday = currentDate.startOf("month").startOf("isoWeek");
    const lastSunday = currentDate.endOf("month").endOf("isoWeek");

    const eventMap = new Map<string, SchedulerType[]>();

    if (schedulers) {
      schedulers.forEach((elm) => {
        const events = eventMap.get(elm.cronDay.toString()) || [];
        events.push(elm);
        eventMap.set(elm.cronDay.toString(), events);
      });
    }

    const monthDays = [[firstMonday]];
    let curDay = firstMonday.add(1, "day");
    let curWeek = 0;

    while (curDay.isBefore(lastSunday)) {
      monthDays[curWeek].push(curDay);
      if (curDay.day() === 0 && !curDay.isSame(lastSunday, "day")) {
        monthDays.push([]);
        curWeek++;
      }
      curDay = curDay.add(1, "day");
    }

    return (
      <>
        {monthDays.map((week) => {
          return (
            <div
              className="grid grid-cols-7 gap-x-2 mt-2"
              key={week[0].toString()}
            >
              {week.map((day) => {
                const events = eventMap.get(day.date().toString());

                return (
                  <MonthDay date={day} key={day.toString()} events={events} />
                );
              })}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="col-span-3">
      <div className="w-full flex justify-between">
        <div className="w-xs flex">
          <DatePicker
            date={currentDate.toDate()}
            setDate={handleSelectDate}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrevMonth}>
            <ChevronsLeft />
          </Button>
          <Button onClick={handleNextMonth}>
            <ChevronsRight />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-x-2">
        {[0, 1, 2, 3, 4, 5, 6].map((elm) => {
          const day = dayjs().day((elm + 1) % 7); // Monday → Sunday
          return (
            <div
              key={day.format("ddd")}
              className="justify-center flex items-center py-2"
            >
              {day.format("ddd")}
            </div>
          );
        })}
      </div>

      {renderMonthDay()}
    </div>
  );
};

export default Scheduler;
