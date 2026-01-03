"use client";

import { useEffect } from "react";

import { useLocale } from "next-intl";
import { ToastBar, Toaster } from "react-hot-toast";

import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/queryProvider";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/vi";
import { Check, X } from "lucide-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  return (
    <QueryProvider>
      {children}
      <Toaster
        gutter={5}
        toastOptions={{
          style: {
            background: "transparent",
            boxShadow: "none",
            height: "56px",
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {(props) => {
              const { icon, message } = props;
              return (
                <div
                  className={cn(
                    "max-w-[80vw] min-h-14 pl-10 rounded-lg text-white flex font-semibold relative justify-center items-center",
                    t.type === "error" && "bg-[#B80704]",
                    t.type === "success" &&
                      " bg-[linear-gradient(90.44deg,#091D13_-11.04%,#247252_99.93%)]"
                  )}
                >
                  <div className="absolute top-2/4 -translate-y-2/4 left-4">
                    {icon ? icon : t.type === "error" ? <X /> : <Check />}
                  </div>
                  <div className="truncate">{message}</div>
                </div>
              );
            }}
          </ToastBar>
        )}
      </Toaster>
    </QueryProvider>
  );
}
