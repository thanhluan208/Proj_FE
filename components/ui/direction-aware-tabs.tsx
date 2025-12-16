"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { capitalize } from "lodash";

import { ScrollArea, ScrollBar } from "./scroll-area";

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};

interface OgImageSectionProps {
  tabs: Tab[];
  className?: string;
  rounded?: string;
  onChange?: () => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  contentClassname?: string;
}

function DirectionAwareTabs({
  tabs,
  className,
  rounded,
  onChange,
  activeTab,
  setActiveTab,
  contentClassname,
}: OgImageSectionProps) {
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ref, bounds] = useMeasure();

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
    return activeTabContent || null;
  }, [activeTab, tabs]);

  const handleTabClick = (newTabId: string) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1;
      setDirection(newDirection);
      setActiveTab(newTabId);
      onChange ? onChange() : null;
    }
  };

  const variants = {
    initial: (direction: number) => ({
      x: 300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      x: -300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className={cn(
          "flex border border-none  w-full rounded-lg cursor-pointer  px-[3px] py-[3.2px] shadow-inner-shadow",
          className,
          rounded
        )}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={(e) => {
              e.stopPropagation();
              !tab.disabled && handleTabClick(tab.id);
            }}
            className={cn(
              "relative  h-[42px] bg-background px-3.5 py-1.5 flex-1 justify-center text-xs sm:text-sm font-medium  transition  flex gap-2 items-center ",
              tab?.disabled && "opacity-50",
              index === 0 && "rounded-l-lg",
              index === tabs.length - 1 && "rounded-r-lg",
              rounded,
              activeTab === tab.id && "text-white"
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
            disabled={tab.disabled}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="bubble"
                className="absolute rounded-lg inset-0 z-10 bg-primary text-white   "
                transition={{ type: "spring", bounce: 0.19, duration: 0.5 }}
              />
            )}

            <p className="z-20">{capitalize(tab.label)}</p>
          </button>
        ))}
      </div>
      <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
        <motion.div
          className="relative mx-auto w-full h-full overflow-hidden"
          initial={false}
          animate={{ height: bounds.height + 10 }}
        >
          <div className={cn("p-1 ", contentClassname)} ref={ref}>
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={activeTab}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
                className="h-full"
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  );
}
export { DirectionAwareTabs };
