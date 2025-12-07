import { Link } from "@/i18n/routing";
import { Routes } from "@/lib/constant";
import { cn } from "@/lib/utils";
import StoreProvider from "@/providers/StoreProvider";
import { getUserData } from "@/server/auth";
import {
  Banknote,
  CalendarCheck2,
  FolderClock,
  Home,
  LogOut,
  MonitorDot,
  Pencil,
  Plus,
  ReceiptText,
  User,
  UserRoundPlus,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import SidebarHouseList from "./components/houses";

const OwnerLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const response = await getUserData();
  const userProfile = response?.data;

  const commonRoute = [
    {
      href: Routes.DASHBOARD,
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
      href: Routes.BILLS,
      label: "Bills",
      icon: Banknote,
    },
    {
      href: Routes.HISTORY,
      label: "History",
      icon: FolderClock,
    },
  ];

  return (
    <div className="bg-neutral-90 p-3 pt-5 flex min-h-screen w-screen">
      <div className="max-h-[cacl(100vh-32px)] w-[308px] no-scrollbar overflow-y-auto">
        <div className="flex flex-col gap-5 ">
          <div className="rounded-xl p-3 items-center flex gap-2 justify-between bg-neutral-100">
            <div className="items-center flex gap-2">
              <Image
                src="/images/mascot/avatar.png"
                alt="LD"
                className="rounded-full"
                width={32}
                height={32}
              />
              <div>
                <p className="text-sm font-semibold">{`${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`}</p>
                <p className="text-xs text-neutral-400 max-w-[180px] truncate">
                  {userProfile?.email || ""}
                </p>
              </div>
            </div>

            <LogOut className="w-4 h-4 text-destructive cursor-pointer" />
          </div>
          <div className="rounded-xl  items-center flex-col flex bg-neutral-100 overflow-hidden ">
            {commonRoute.map((route, index) => {
              return (
                <Link
                  href={route.href}
                  key={route.href}
                  className={cn(
                    "flex items-center relative justify-between group gap-2.5 w-full text-sm py-3.5 px-3 pl-6 hover:bg-neutral-90/60 hover:text-primary-60",
                    index !== 0 && "border-t border-neutral-90/20"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {<route.icon className="w-4 h-4" />}
                    <p>{route.label}</p>
                  </div>

                  <p className="text-neutral-400 group-hover:text-primary-60 text-xs">
                    {Math.floor(Math.random() * 100)}
                  </p>
                </Link>
              );
            })}
          </div>

          <SidebarHouseList />

          <div className="rounded-xl  items-center flex-col flex bg-neutral-100 overflow-hidden ">
            <div className="flex items-center relative text-neutral-400 justify-between group gap-2.5 w-full text-sm py-3.5 px-3 pl-6 hover:bg-neutral-90/60 hover:text-primary-60">
              <p className="text-sm ">Tenant</p>
              <UserRoundPlus className="w-4 h-4 " />
            </div>

            {[1, 2, 3, 4].map((_, index) => {
              return (
                <Link
                  href={`${Routes.house(String(index))}`}
                  key={index}
                  className={cn(
                    "flex items-center relative justify-between group gap-2.5 w-full text-sm py-3.5 px-3 pl-8 hover:bg-neutral-90/60 hover:text-primary-60",
                    index !== 0 && "border-t border-neutral-90/20"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {<User className="w-4 h-4" />}
                    <p>{`Tenant ${index + 1}`}</p>
                  </div>

                  <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary-60" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <StoreProvider profile={response.data}>{children}</StoreProvider>
    </div>
  );
};

export default OwnerLayout;
