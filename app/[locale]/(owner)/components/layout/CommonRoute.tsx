"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetHouse } from "@/hooks/houses/useGetListHouse";
import { Link, usePathname } from "@/i18n/routing";
import { Routes } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { House, LucideProps } from "lucide-react";
import React, { ReactNode, useMemo } from "react";

interface CommonRouteProps {
  href: string;
  label: string;
  icon: ReactNode;
  isHouseList?: boolean;
}

const CommonRoute = ({ href, label, icon, isHouseList }: CommonRouteProps) => {
  const pathname = usePathname();
  console.log("path", pathname);

  const { data: houses } = useGetHouse({ enable: href.includes("house") });

  const isActive =
    (pathname === Routes.ROOT && href === Routes.ROOT) ||
    (pathname.includes(href) && href !== Routes.ROOT);

  const renderContent = () => {
    if (href.includes("house")) {
      return (
        <div className="flex flex-col gap-2">
          {houses?.data.map((elm) => {
            return (
              <div key={elm.id} className="flex items-start gap-2">
                <House className="w-4 h-4 mt-1" />
                <div className="cursor-pointer">
                  <Link
                    href={Routes.house(elm.id)}
                    className="text-sm font-bold hover:underline"
                  >
                    {elm.name}
                  </Link>
                  <p className="text-xs max-w-sm">{elm.address}</p>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return <p>{label}</p>;
  };

  const linkHref = useMemo(() => {
    if (isHouseList)
      return houses?.data?.[0]?.id ? Routes.house(houses?.data?.[0]?.id) : "";

    return href;
  }, [isHouseList, href, houses]);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={linkHref}
          onClick={(e) => {
            if (!linkHref) e.preventDefault();
          }}
        >
          <div className="flex items-center gap-2.5 justify-center cursor-pointer group">
            <div
              className={cn(
                "w-10 h-10 group-hover:bg-primary-foreground group-hover:text-secondary flex justify-center items-center text-primary-foreground rounded-md bg-transparent transition-colors",
                isActive && "bg-primary-foreground text-secondary"
              )}
            >
              {icon}
            </div>
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{renderContent()}</TooltipContent>
    </Tooltip>
  );
};

export default CommonRoute;
