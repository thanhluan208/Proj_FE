"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LANGUAGE } from "@/types";
import { Monitor, Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

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

  return (
    <div className="flex flex-col gap-4 xl:gap-2 p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
      <div className="flex flex-col xl:flex-row gap-2 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 px-2">
          <Languages className="w-4 h-4" />
          <span className="text-xs font-medium hidden xl:inline">Language</span>
        </div>
        <ToggleGroup
          type="single"
          value={locale}
          onValueChange={handleLanguageChange}
          size="sm"
          className="flex-col xl:flex-row bg-background/50 border rounded-lg p-0.5 gap-1 xl:gap-0"
        >
          <ToggleGroupItem
            value={LANGUAGE.EN}
            className="h-7 w-full xl:w-8 px-0 text-xs data-[state=on]:bg-white dark:data-[state=on]:bg-neutral-800 shadow-sm rounded-md xl:rounded-none xl:first:rounded-l-md xl:last:rounded-r-md"
          >
            EN
          </ToggleGroupItem>
          <ToggleGroupItem
            value={LANGUAGE.VI}
            className="h-7 w-full xl:w-8 px-0 text-xs data-[state=on]:bg-white dark:data-[state=on]:bg-neutral-800 shadow-sm rounded-md xl:rounded-none xl:first:rounded-l-md xl:last:rounded-r-md"
          >
            VI
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-col xl:flex-row gap-2 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 px-2">
          <Sun className="w-4 h-4 dark:hidden" />
          <Moon className="w-4 h-4 hidden dark:block" />
          <span className="text-xs font-medium hidden xl:inline">Theme</span>
        </div>
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={handleThemeChange}
          size="sm"
          className="flex-col xl:flex-row bg-background/50 border rounded-lg p-0.5 gap-1 xl:gap-0"
        >
          <ToggleGroupItem
            value="light"
            className="h-7 w-full xl:w-8 px-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground shadow-sm rounded-md xl:rounded-none xl:first:rounded-l-md xl:last:rounded-r-md"
          >
            <Sun className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="dark"
            className="h-7 w-full xl:w-8 px-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:rounded-md shadow-sm rounded-md xl:rounded-none xl:first:rounded-l-md xl:last:rounded-r-md"
          >
            <Moon className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="system"
            className="h-7 w-full xl:w-8 px-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground shadow-sm rounded-md xl:rounded-none xl:first:rounded-l-md xl:last:rounded-r-md"
          >
            <Monitor className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
