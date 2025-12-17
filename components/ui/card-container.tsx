"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

interface CardContainerProps extends ComponentPropsWithoutRef<"div"> {
  cardTitle?: ReactNode;
  subTitle?: ReactNode;
  actions?: ReactNode;
  defaultOpen?: boolean;
  name: string;
}

const CardContainer: FC<CardContainerProps> = ({
  cardTitle,
  actions,
  subTitle,
  children,
  defaultOpen,
  name,
  className,
}) => {
  const tCommon = useTranslations("common");

  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (defaultOpen || !!window.localStorage.getItem(`card_${name}`))
    ) {
      console.log("window", window.localStorage.getItem(`card_${name}`));
      setValue(name);
    }
  }, [defaultOpen, name]);

  return (
    <Accordion
      type="single"
      collapsible
      onValueChange={(value) => {
        if (value) window.localStorage.setItem(`card_${name}`, "1");
        else window.localStorage.removeItem(`card_${name}`);
        setValue(value);
      }}
      value={value}
    >
      <AccordionItem value={name}>
        <div
          className={cn("bg-card shadow-sm p-6 md:p-8 rounded-2xl", className)}
        >
          <div className="flex flex-col cursor-pointer items-start sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {cardTitle}
                </h2>
                <div className="text-sm text-muted-foreground">{subTitle}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end flex-wrap">
              {actions}
            </div>
          </div>

          <AccordionContent>{children}</AccordionContent>

          <div className="w-full items-center justify-center [&>h3]:w-fit! flex">
            <AccordionTrigger className="p-0 w-fit! hover:no-underline text-xs text-muted-foreground hover:text-primary transition-colors">
              <span>{tCommon("viewDetails")}</span>
            </AccordionTrigger>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default CardContainer;
