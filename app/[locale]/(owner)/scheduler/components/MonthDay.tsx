import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DirectionAwareTabs } from "@/components/ui/direction-aware-tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BillingTypeEnum } from "@/types/billing.type";
import { Scheduler } from "@/types/scheduler.type";
import dayjs, { Dayjs } from "dayjs";
import { Fuel, Receipt, ReceiptText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

interface MonthDayProps {
  date: Dayjs;
  events?: Scheduler[];
}

enum Tabs {
  ROOM_EXPENSE = "ROOM_EXPENSE",
  HOUSE_EXPENSE = "HOUSE_EXPENSE",
}

const MonthDay = ({ date, events }: MonthDayProps) => {
  const t = useTranslations("scheduler");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>(Tabs.HOUSE_EXPENSE);

  const currentDateSearch = searchParams.get("date");
  const currentDate = dayjs(currentDateSearch).isValid()
    ? dayjs(currentDateSearch)
    : dayjs();

  const isNotSameMonth = !date.isSame(currentDate, "month");
  const isToday = date.isSame(dayjs(), "date");

  const tabs = useMemo(
    () => [
      {
        id: Tabs.ROOM_EXPENSE,
        label: t("tabs.expense"),
        content: <div>{t("tabs.expense")}</div>,
      },
      {
        id: Tabs.HOUSE_EXPENSE,
        label: t("tabs.houseExpense"),
        content: <div>{t("tabs.houseExpense")}</div>,
      },
    ],
    [t]
  );

  const renderIcon = (event: Scheduler) => {
    if (event.metadata?.type === BillingTypeEnum.RECURRING) {
      return <Receipt className="w-3.5 h-3.5" />;
    }
    if (event.metadata?.type === BillingTypeEnum.USAGE_BASED) {
      return <Fuel className="w-3.5 h-3.5" />;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "min-h-32 rounded-2xl p-4 flex cursor-pointer flex-col gap-2 transition-all duration-200 ease-in-out relative group text-left outline-none",
          "active:scale-95 active:shadow-none active:translate-y-0",
          date.isSame(currentDate, "month") ? "opacity-100" : "opacity-40",
          (!events || isNotSameMonth) && [
            "bg-card border border-border shadow-md",
            "hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-1",
          ],
          !!events &&
            !isNotSameMonth && [
              "bg-secondary text-secondary-foreground border-transparent shadow-lg shadow-secondary/30",
              "hover:bg-secondary/90 hover:shadow-xl hover:shadow-secondary/40 hover:-translate-y-1",
            ],
          isToday &&
            "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/50 hover:-translate-y-1"
        )}
      >
        <span
          className={cn(
            "text-sm font-bold transition-colors duration-200",
            !events && "text-secondary group-hover:text-primary-foreground",
            !!events && "text-secondary-foreground",
            isToday && "text-primary-foreground"
          )}
        >
          {date.format(isNotSameMonth ? "D/MM" : "D")}
        </span>
        {!!events && !isNotSameMonth && (
          <div className="flex flex-col gap-1.5 mt-auto">
            <div className="flex items-center gap-1.5 flex-wrap">
              {events.map((event) => {
                return (
                  <div
                    className="px-1 rounded-md bg-secondary-foreground/20"
                    key={event.id}
                  >
                    <Tooltip>
                      <TooltipTrigger>{renderIcon(event)}</TooltipTrigger>
                      <TooltipContent>
                        <div>
                          <p className="font-extrabold">{t("tooltip.bill")}</p>
                          <p>
                            {t("tooltip.room")}: {event.room.name}
                          </p>
                          <p>
                            {t("tooltip.type")}:{" "}
                            {event.metadata?.type &&
                              tCommon(
                                String(event.metadata?.type).toLowerCase()
                              )}
                          </p>
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
              {t("dialog.title", { date: date.format("ddd DD/MM/YYYY") })}
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
