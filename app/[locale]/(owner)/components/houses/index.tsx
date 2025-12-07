"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetHouse } from "@/hooks/houses/useGetListHouse";
import { Link, useRouter } from "@/i18n/routing";
import { Routes } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { Home, Pencil, Plus } from "lucide-react";
import React from "react";
import AddHouseButton from "./AddHouseButton";
import AddRoomButton from "./AddRoomButton";

const SidebarHouseList = () => {
  const router = useRouter();

  const { data, isFetching } = useGetHouse();

  return (
    <div className="rounded-xl  items-center flex-col flex bg-neutral-100 overflow-hidden hover:shadow-sm transition-shadow">
      <div className="flex items-center relative text-neutral-400 justify-between group gap-2.5 w-full text-sm py-3.5 px-3 pl-6 hover:bg-neutral-90/60 hover:text-primary-60">
        <p className="text-sm ">House</p>
        <AddHouseButton />
      </div>

      {isFetching &&
        [1, 2, 3].map((_, index) => {
          return (
            <div
              key={index}
              className={cn(
                "flex items-center relative justify-between group gap-2.5 w-full text-sm p-1 pl-8 hover:bg-neutral-90/60 hover:text-primary-60",
                index !== 0 && "border-t border-neutral-90/20"
              )}
            >
              <Skeleton className="h-10 w-full" />
            </div>
          );
        })}

      {data?.data &&
        !isFetching &&
        data?.data?.map((house, index) => {
          return (
            <div
              key={house.id}
              className={cn(
                "flex items-center hover:underline cursor-pointer relative justify-between group gap-2.5 w-full text-sm py-3.5 px-3 pl-8 hover:bg-neutral-90/60 hover:text-primary-60",
                index !== 0 && "border-t border-neutral-90/20"
              )}
            >
              <div className="flex items-center gap-2.5">
                {<Home className="w-4 h-4" />}
                <Link href={`${Routes.house(house.id)}`}>{house.name}</Link>
              </div>

              <AddRoomButton houseId={house.id} />
            </div>
          );
        })}
    </div>
  );
};

export default SidebarHouseList;
