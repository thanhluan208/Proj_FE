"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LANGUAGE } from "@/types";
import { motion } from "framer-motion";
import { Languages, Monitor, Moon, Settings, Sun } from "lucide-react";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface Tab {
  id: string;
  label: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  layoutId: string;
}

const AnimatedTabs = ({
  tabs,
  activeTab,
  onChange,
  layoutId,
}: AnimatedTabsProps) => {
  return (
    <div className="flex w-full bg-muted p-1 rounded-lg border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            activeTab === tab.id
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          type="button"
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-0 z-0 bg-primary rounded-md shadow-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="z-10 relative flex items-center gap-2">
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export const SettingsToggle = () => {
  const { setTheme, theme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLanguageChange = (value: string) => {
    if (!value) return;
    router.replace(pathname, { locale: value });
  };

  const handleThemeChange = (value: string) => {
    if (!value) return;
    setTheme(value);
  };

  const languageTabs: Tab[] = [
    { id: LANGUAGE.EN, label: "English" },
    { id: LANGUAGE.VI, label: "Tiếng Việt" },
  ];

  const themeTabs: Tab[] = [
    {
      id: "light",
      label: (
        <>
          <Sun className="w-4 h-4" /> Light
        </>
      ),
    },
    {
      id: "dark",
      label: (
        <>
          <Moon className="w-4 h-4" /> Dark
        </>
      ),
    },
    {
      id: "system",
      label: (
        <>
          <Monitor className="w-4 h-4" /> System
        </>
      ),
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2.5 justify-center cursor-pointer group">
          <div
            className={
              "w-10 h-10 group-hover:bg-primary-foreground group-hover:text-secondary flex justify-center items-center  rounded-md bg-transparent transition-colors"
            }
          >
            <Settings className="w-5 h-5 " />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent side="right" className="w-80 m-2 p-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <Languages className="w-4 h-4" />
              <span className="text-sm font-medium">Language</span>
            </div>
            <AnimatedTabs
              tabs={languageTabs}
              activeTab={locale}
              onChange={handleLanguageChange}
              layoutId="language-tabs"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <Sun className="w-4 h-4 dark:hidden" />
              <Moon className="w-4 h-4 hidden dark:block" />
              <span className="text-sm font-medium">Theme</span>
            </div>
            <AnimatedTabs
              tabs={themeTabs}
              activeTab={theme || "system"}
              onChange={handleThemeChange}
              layoutId="theme-tabs"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
