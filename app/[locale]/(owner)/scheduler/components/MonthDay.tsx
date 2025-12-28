import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import { cn } from "@/lib/utils";
import { Scheduler, SchedulerType } from "@/types/scheduler.type";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ReceiptText } from "lucide-react";
import { useGetListBilling } from "@/hooks/bills/useGetListBill";
import { useGetListContract } from "@/hooks/contracts/useGetListContract";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MonthDayProps {
  date: Dayjs;
  events?: Scheduler[];
}

enum Tabs {
  ROOM_EXPENSE = "ROOM_EXPENSE",
  HOUSE_EXPENSE = "HOUSE_EXPENSE",
}

const MonthDay = ({ date, events }: MonthDayProps) => {
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>(Tabs.HOUSE_EXPENSE);

  const currentDateSearch = searchParams.get("date");
  const currentDate = dayjs(currentDateSearch).isValid()
    ? dayjs(currentDateSearch)
    : dayjs();

  const isNotSameMonth = !date.isSame(currentDate, "month");

  const tabs = useMemo(
    () => [
      {
        id: Tabs.ROOM_EXPENSE,
        label: "Expense scheduler",
        content: <div>Expense scheduler</div>,
      },
      {
        id: Tabs.HOUSE_EXPENSE,
        label: "House expense scheduler",
        content: <div>House expense scheduler</div>,
      },
    ],
    []
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "min-h-32 rounded-2xl p-4 flex cursor-pointer flex-col gap-2 transition-all duration-200 ease-in-out relative group text-left outline-none",
          "active:scale-95 active:shadow-none active:translate-y-0",
          date.isSame(currentDate, "month") ? "opacity-100" : "opacity-40",
          !event && [
            "bg-card border border-border shadow-md",
            "hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-1",
          ],
          !!events && [
            "bg-secondary text-secondary-foreground border-transparent shadow-lg shadow-secondary/30",
            "hover:bg-secondary/90 hover:shadow-xl hover:shadow-secondary/40 hover:-translate-y-1",
          ]
        )}
      >
        <span
          className={cn(
            "text-sm font-bold transition-colors duration-200",
            !event && "text-secondary group-hover:text-primary-foreground",
            !!events && "text-secondary-foreground"
          )}
        >
          {date.format(isNotSameMonth ? "D/MM" : "D")}
        </span>
        {!!events && (
          <div className="flex flex-col gap-1.5 mt-auto">
            <div className="flex items-center gap-1.5">
              {events.map((event) => {
                return (
                  <div
                    className="px-1 rounded-md bg-secondary-foreground/20"
                    key={event.id}
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <ReceiptText className="w-3.5 h-3.5" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div>
                          <p className="font-extrabold">Bill</p>
                          <p>Room: {event.room.name}</p>
                          <p>Type: {event.metadata?.type}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="lg:max-w-xl w-100vw"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              Scheduler for {date.format("ddd DD/MM/YYYY")}
            </DialogTitle>
          </DialogHeader>

          <DirectionAwareTabs
            tabs={tabs}
            activeTab={currentTab}
            setActiveTab={setCurrentTab}
            contentClassname="max-h-[70vh] p-0 h-[70vh] overflow-y-auto"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonthDay;
