import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, usePathname } from "@/i18n/routing";
import { Routes } from "@/lib/constant";
import { cn } from "@/lib/utils";
import StoreProvider from "@/providers/StoreProvider";
import { getUserData } from "@/server/auth";
import {
  Banknote,
  CalendarCheck2,
  FolderClock,
  House,
  MonitorDot,
  ReceiptText,
} from "lucide-react";
import React from "react";
import CommonRoute from "./components/layout/CommonRoute";

const OwnerLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const response = await getUserData();

  const userProfile = response?.data;

  const commonRoute = [
    {
      href: Routes.ROOT,
      label: "Dashboard",
      icon: MonitorDot,
    },
    {
      href: Routes.CONTRACTS,
      label: "Contracts",
      icon: ReceiptText,
    },
    {
      href: Routes.SCHEDULER,
      label: "Scheduler",
      icon: CalendarCheck2,
    },
    {
      href: Routes.house(),
      label: "Bills",
      icon: House,
      isHouseList: true,
    },
    {
      href: Routes.HISTORY,
      label: "History",
      icon: FolderClock,
    },
  ];

  return (
    <div
      className={cn(
        "pt-2 p-3 pl-20",
        "bg-neutral-90  xl:pt-5 flex min-h-screen w-screen"
      )}
    >
      <div className="fixed left-0 top-0 w-20 pr-2 h-screen flex items-center justify-center ">
        <div className="w-full py-5 bg-primary relative rounded-r-[38px] flex justify-center flex-col gap-5">
          <div
            className={cn(
              "absolute -top-14 bg-primary w-full h-14 ",
              "after:content-[''] after:absolute after:w-full after:h-full after:bg-neutral-90 after:rounded-bl-[40px]"
            )}
          />
          <div
            className={cn(
              "absolute -bottom-14 bg-primary w-full h-14 ",
              "after:content-[''] after:absolute after:w-full after:h-full after:bg-neutral-90 after:rounded-tl-[40px]"
            )}
          />
          {commonRoute.map((route) => {
            return (
              <CommonRoute
                icon={<route.icon className="w-5 h-5" />}
                href={route.href}
                label={route.label}
                key={route.href}
                isHouseList={route.isHouseList}
              />
            );
          })}
        </div>
      </div>
      <StoreProvider profile={response.data}>
        <div className="pl-2 w-full">{children}</div>
      </StoreProvider>
    </div>
  );
};

export default OwnerLayout;
