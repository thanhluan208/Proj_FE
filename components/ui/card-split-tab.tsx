"use client";

import { cn } from "@/lib/utils";
import {
  ComponentPropsWithoutRef,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { DirectionAwareTabs, Tab } from "./direction-aware-tabs";

interface CardSplitTabProps extends ComponentPropsWithoutRef<"div"> {
  tabs?: Tab[];
  containerClassname?: string;
  cardTitle?: ReactNode;
}

const CardSplitTab = ({
  tabs,
  className,
  containerClassname,
  cardTitle,
}: CardSplitTabProps) => {
  const [activeTab, setActiveTab] = useState(tabs ? tabs[0].id : undefined);

  const renderCustomHeader = useCallback(
    (handleTabClick: (id: string) => void) => {
      if (!tabs) return null;

      return (
        <div
          className={cn(
            "w-full bg-card flex relative justify-center items-center",
            className
          )}
        >
          <div
            className={cn(
              "py-3 px-5 text-sm rounded-b-xl flex items-center relative justify-between bg-neutral-90 w-fit gap-5"
            )}
          >
            <div className="w-5 bg-neutral-90 -left-5 h-full absolute after:content-[''] after:absolute after:w-full after:h-full after:bg-card after:rounded-tr-xl " />
            <div className="w-5 bg-neutral-90 -right-5 h-full absolute after:content-[''] after:absolute after:w-full after:h-full after:bg-card after:rounded-tl-xl " />
            {tabs.map((elm) => {
              return (
                <p
                  key={elm.id}
                  className={cn(
                    "cursor-pointer transition-colors",
                    activeTab === elm.id && "text-primary font-semibold"
                  )}
                  onClick={() => handleTabClick(elm.id)}
                >
                  {elm.label}
                </p>
              );
            })}
          </div>
        </div>
      );
    },
    [tabs, activeTab]
  );

  if (activeTab && tabs)
    return (
      <DirectionAwareTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customHeader={renderCustomHeader}
        containerClassname={cn(
          "rounded-2xl overflow-hidden bg-card",
          containerClassname
        )}
      />
    );

  return null;
};

export default CardSplitTab;
