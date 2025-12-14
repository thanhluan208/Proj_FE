"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ImageDialog } from "@/components/ui/image-dialog";
import { cn, formatCurrency } from "@/lib/utils";
import { RoomExpense } from "@/types/rooms.type";
import dayjs from "dayjs";
import { Calendar, DollarSign, Receipt } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import ExpenseActionButton from "./ExpenseActionButton";
// import ExpenseDeleteButton from "./ExpenseDeleteButton";

interface ExpenseCardProps {
  expense: RoomExpense;
  onEdit?: (expense: RoomExpense) => void;
  onDelete?: (expense: RoomExpense) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen] = useState<string | undefined>(undefined);
  const t = useTranslations("expense");
  const tCommon = useTranslations("common");

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      utilities: "bg-blue-100 text-blue-700",
      maintenance: "bg-orange-100 text-orange-700",
      cleaning: "bg-green-100 text-green-700",
      supplies: "bg-purple-100 text-purple-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[category?.toLowerCase() || "other"] || colors.other;
  };

  const hasDetail = expense.notes || expense.receipt;

  return (
    <div className="group relative">
      <Accordion
        type="single"
        collapsible
        value={hasDetail ? open : undefined}
        className="bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <AccordionItem value="details" className="border-none">
          {/* Header Section */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {expense.name}
                  </h3>
                  <div
                    className={cn(
                      "inline-flex justify-start items-center gap-1.5  py-0.5 rounded-full text-xs font-medium mt-1"
                    )}
                  >
                    <Calendar className="w-3 h-3" />
                    {dayjs(expense.date).format("DD/MM/YYYY")}
                  </div>
                </div>
              </div>

              <ExpenseActionButton expense={expense} />
            </div>

            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-border/50">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {t("amount")}
              </span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          </div>

          {/* Expandable Details */}
          <AccordionContent>
            <div className="px-5 pb-5 pt-0">
              <div className="border-t border-border pt-4">
                {expense.notes && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Notes
                    </h4>
                    <p className="text-sm text-muted-foreground italic">
                      {expense.notes}
                    </p>
                  </div>
                )}

                {expense.receipt && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Receipt
                    </h4>
                    <img />
                    <ImageDialog
                      src={`/api/doorly/files/${expense.receipt.id}/preview`}
                      alt={expense.name}
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  Created: {dayjs(expense.createdAt).format("DD/MM/YYYY")}
                </span>
                {expense.updatedAt && (
                  <span>
                    Updated: {dayjs(expense.updatedAt).format("DD/MM/YYYY")}
                  </span>
                )}
              </div>
            </div>
          </AccordionContent>

          {hasDetail && (
            <div className="px-5 pb-2 flex justify-center">
              <AccordionTrigger
                onClick={() => (open ? setOpen(undefined) : setOpen("details"))}
                className="pt-0 pb-2 hover:no-underline text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="mr-1">{tCommon("viewDetails")}</span>
              </AccordionTrigger>
            </div>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ExpenseCard;
