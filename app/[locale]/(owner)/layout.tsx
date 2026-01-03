import { Link } from "@/i18n/routing";
import { Routes } from "@/lib/constant";
import { cn } from "@/lib/utils";
import StoreProvider from "@/providers/StoreProvider";
import { getUserData } from "@/server/auth";
import { CalendarCheck2, House, MonitorDot } from "lucide-react";
import Image from "next/image";
import React from "react";
import ButtonLogout from "./components/layout/ButtonLogout";
import CommonRoute from "./components/layout/CommonRoute";
import { SettingsToggle } from "./components/layout/settings-toggle";

const OwnerLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const response = await getUserData();

  const commonRoute = [
    {
      href: Routes.ROOT,
      label: "Dashboard",
      icon: MonitorDot,
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
  ];

  return (
    <div
      className={cn(
        "pt-2 p-3 pl-16 no-scrollbar",
        "bg-neutral-90  xl:pt-5 flex min-h-screen w-screen"
      )}
    >
      <div className="fixed left-0 py-5 top-0 w-16 pr-2 h-screen flex flex-col items-center justify-between ">
        <Link href={Routes.PROFILE}>
          <div>
            <Image
              src="/images/mascot/avatar.png"
              width={40}
              height={40}
              className="rounded-full"
              alt="profile"
            />
          </div>
        </Link>
        <div />
        <div className="w-full absolute top-2/4 -translate-y-2/4  py-5 bg-primary  rounded-r-[34px] flex justify-center flex-col gap-5">
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
        <div className="flex flex-col gap-2 items-center">
          <SettingsToggle />

          <ButtonLogout />
        </div>
      </div>
      <StoreProvider profile={response.data}>
        <div className="pl-2 w-full">{children}</div>
      </StoreProvider>
    </div>
  );
};

export default OwnerLayout;
