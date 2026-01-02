"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatFullName } from "@/lib/utils";
import { Contract } from "@/types/contract.type";
import { format } from "date-fns";
import {
  AlertCircle,
  Armchair,
  ArrowUp,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  Droplets,
  Edit2,
  FileText,
  HomeIcon,
  MoreVertical,
  Phone,
  Sparkles,
  Star,
  Trash2,
  User,
  Wifi,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import ContractDeleteButton from "./ContractDeleteButton";
import useContractMutation from "@/hooks/contracts/useContractMutation";
import DeleteButton from "@/components/ui/delete-button";
import ContractAction from "./ContractAction";

interface ContractCardProps {
  contract: Contract;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract, onEdit }) => {
  const t = useTranslations("contract");

  console.log("contract", contract);
  const { deleteContract } = useContractMutation();

  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(value));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return "N/A";
    }
  };

  const getStatus = () => {
    const now = new Date();
    const start = new Date(contract.startDate);
    const end = new Date(contract.endDate);

    if (contract.deletedAt)
      return {
        label: t("status.deleted"),
        color: "bg-red-100 text-red-700",
        icon: Trash2,
      };

    if (contract.status?.id === 2)
      return {
        label: t("status.inactive"),
        color: "bg-gray-100 text-gray-700",
        icon: AlertCircle,
      };

    if (now < start)
      return {
        label: t("status.upcoming"),
        color: "bg-blue-100 text-blue-700",
        icon: Clock,
      };
    if (now > end)
      return {
        label: t("status.expired"),
        color: "bg-gray-100 text-gray-700",
        icon: AlertCircle,
      };
    return {
      label: t("status.active"),
      color: "bg-green-100 text-green-700",
      icon: CheckCircle2,
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  const fees = [
    {
      label: t("card.fees.electricity"),
      value:
        Number(contract.fixed_electricity_fee) > 0
          ? formatCurrency(contract.fixed_electricity_fee)
          : `${formatCurrency(contract.price_per_electricity_unit)} / kWh`,
      icon: Zap,
    },
    {
      label: t("card.fees.water"),
      value:
        Number(contract.fixed_water_fee) > 0
          ? formatCurrency(contract.fixed_water_fee)
          : `${formatCurrency(contract.price_per_water_unit)} / m³`,
      icon: Droplets,
    },
    {
      label: t("card.fees.internet"),
      value: formatCurrency(contract.internet_fee),
      icon: Wifi,
    },
    {
      label: t("card.fees.parking"),
      value: formatCurrency(contract.parking_fee),
      icon: Car,
    },
    {
      label: t("card.fees.cleaning"),
      value: formatCurrency(contract.cleaning_fee),
      icon: Sparkles,
    },
    {
      label: t("card.fees.living"),
      value: formatCurrency(contract.living_fee),
      icon: Armchair,
    },
    {
      label: t("card.fees.overRentalFee"),
      value: formatCurrency(contract.overRentalFee),
      icon: AlertCircle,
    },
  ];

  return (
    <div className="group relative">
      <Accordion
        type="single"
        collapsible
        className="bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <AccordionItem value="details" className="border-none">
          {/* Header Section */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {t("card.contractNumber")} {contract.id.slice(0, 8)}
                  </h3>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${status.color}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>
              </div>

              <ContractAction data={contract} />
            </div>

            <div className="grid grid-cols-3  mb-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {t("form.startDate")}
                </p>
                <p className="text-sm font-medium">
                  {formatDate(contract.startDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {t("form.endDate")}
                </p>
                <p className="text-sm font-medium">
                  {formatDate(contract.endDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" /> {t("form.tenants")}
                </p>
                <div className="flex gap-1 flex-col flex-wrap">
                  {contract.tenantContracts &&
                    contract.tenantContracts?.map((elm) => {
                      return (
                        <div
                          key={elm.id}
                          className="flex items-center gap-2 justify-start"
                        >
                          <Tooltip>
                            <TooltipTrigger className="text-xs">
                              <p className="max-w-[100px] truncate">
                                {formatFullName(elm.tenant.name)}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex gap-1 items-center">
                                  <User className="w-3 h-3" />{" "}
                                  <p>{elm.tenant.name}</p>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <CreditCard className="w-3 h-3" />{" "}
                                  <p>{elm.tenant.citizenId}</p>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <Phone className="w-3 h-3" />{" "}
                                  <p>{elm.tenant.phoneNumber}</p>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <HomeIcon className="w-3 h-3" />{" "}
                                  <p>{elm.tenant.home}</p>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger>
                              {elm.isMainTenant ? (
                                <Star className="w-2.5 h-2.5 text-yellow-400" />
                              ) : (
                                <ArrowUp className="w-2.5 h-2.5 cursor-pointer hover:text-primary" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent className="max-w-52">
                              {elm.isMainTenant ? (
                                <p>
                                  <strong>{t("card.mainTenantTitle")}</strong>
                                  <br />
                                  <span>{t("card.mainTenantDescription")}</span>
                                </p>
                              ) : (
                                <p>
                                  <strong>
                                    {t("card.updateMainTenantTitle")}
                                  </strong>
                                  <br />
                                  <span>
                                    {t("card.updateMainTenantDescription")}
                                  </span>
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-border/50">
              <span className="text-sm text-muted-foreground">
                {t("card.baseRent")}
              </span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(contract.base_rent)}
              </span>
            </div>
          </div>

          {/* Expandable Details */}
          <AccordionContent>
            <div className="px-5 pb-5 pt-0">
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t("card.monthlyFees")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {fees.map((fee, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start flex-col justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
                      )}
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <fee.icon className="w-4 h-4" />
                        <span>{fee.label}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {fee.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  {t("card.createdAt")}: {formatDate(contract.createdAt)}
                </span>
                {contract.updatedAt && (
                  <span>
                    {t("card.updatedAt")}: {formatDate(contract.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          </AccordionContent>

          <div className="px-5 pb-2 flex justify-center">
            <AccordionTrigger className="pt-0 pb-2 hover:no-underline text-xs text-muted-foreground hover:text-primary transition-colors">
              <span className="mr-1">{t("card.viewDetails")}</span>
            </AccordionTrigger>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ContractCard;
