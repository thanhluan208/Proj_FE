"use client";

import {
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useId,
  useState,
} from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { useTranslations } from "next-intl";

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
}) => {
  const tCommon = useTranslations("common");

  const initOpen = defaultOpen && !!localStorage.getItem(`card_${name}`);

  const [value, setValue] = useState(initOpen ? name : undefined);

  const handleTrigger = () => {
    if (value) {
      localStorage.removeItem(`card_${name}`);
      setValue(undefined);
    } else {
      localStorage.setItem(`card_${name}`, "1");
      setValue(name);
    }
  };

  return (
    <Accordion type="single" collapsible value={value}>
      <AccordionItem value={name}>
        <div className="bg-card  rounded-2xl p-6 md:p-8 shadow-sm border border-border">
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
            <AccordionTrigger
              onClick={handleTrigger}
              className="p-0 w-fit! hover:no-underline text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <span>{tCommon("viewDetails")}</span>
            </AccordionTrigger>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default CardContainer;
