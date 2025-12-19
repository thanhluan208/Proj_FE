"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Tenant } from "@/types/tenants.type";
import dayjs from "dayjs";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  CreditCard,
  Download,
  MapPin,
  Phone,
  Power,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import TenantEditButton from "./TenantEditButton";
import useTenantMutation from "@/hooks/tenants/useTenantMutation";
import { SpinIcon } from "@/components/icons";
import TenantDeleteButton from "./TenantDeleteButton";

interface TenantCardProps {
  tenant: Tenant;
}

const TenantCard: React.FC<TenantCardProps> = ({ tenant }) => {
  const t = useTranslations("tenant");
  const { toggleStatus, downloadIdCards } = useTenantMutation();

  const isPending = toggleStatus.isPending;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status?: { name: string; color?: string }) => {
    if (!status) return "bg-gray-500";
    const color = status.name?.toLowerCase();
    switch (color) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const isActive = tenant.status?.name?.toLowerCase() === "active";

  const handleToggleStatus = () => {
    toggleStatus.mutate(tenant.id);
  };

  const handleDownloadIdCards = async () => {
    try {
      const response = await downloadIdCards.mutateAsync(tenant.id);

      // Get filename from Content-Disposition header
      const disposition = response.headers["content-disposition"];
      let filename = "tenant-id-cards.zip";

      if (disposition) {
        const match = disposition.match(/filename="(.+)"/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      // Create blob URL
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download ID cards:", error);
    }
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <AccordionItem value="details" className="border-none">
        {/* Header with Status - Always Visible */}
        <div className="bg-linear-to-r from-primary/10 relative to-primary/5 p-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base max-w-[120px] sm:max-w-[200px] text-ellipsis font-bold text-foreground group-hover:text-primary transition-colors">
                    {tenant.name}
                  </h3>
                  {/* Edit Button */}
                  {!isPending && <TenantEditButton data={tenant} />}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3 " />
                  {tenant.phoneNumber || t("card.notAvailable")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Badge - Hidden on hover */}
              {tenant.status && (
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold text-white transition-opacity duration-200 group-hover:opacity-0 group-hover:invisible",
                    getStatusColor(tenant.status)
                  )}
                >
                  {tenant.status.name}
                </span>
              )}
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <AccordionTrigger className="p-1 hover:bg-accent/50 rounded-full transition-all opacity-0 invisible group-hover:opacity-100 group-hover:visible data-[state=open]:rotate-180" />
          </div>
        </div>

        {/* Contact Info - Always Visible */}
        <div className="space-y-2 p-4">
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">
              {tenant.citizenId || t("card.notAvailable")}
            </span>
            {tenant.citizenId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleDownloadIdCards}
                    disabled={downloadIdCards.isPending}
                    className="ml-auto p-1 hover:bg-accent rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadIdCards.isPending ? (
                      <SpinIcon />
                    ) : (
                      <Download className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("card.downloadIdCards")}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <span className="text-foreground line-clamp-2">
              {tenant.address || t("card.notAvailable")}
            </span>
          </div>
        </div>

        {/* Accordion Content */}
        <AccordionContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="p-4 pt-0 space-y-3">
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("card.dateOfBirth")}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {dayjs(tenant?.dob).isValid()
                    ? formatDate(tenant.dob as Date)
                    : t("card.notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("card.gender")}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {tenant.sex || t("card.notAvailable")}
                </p>
              </div>
            </div>

            {/* Employment Info */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-start gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {tenant.tenantJob || t("card.notAvailable")}
                  </p>
                  <p className="text-muted-foreground">
                    {tenant.tenantWorkAt || t("card.notAvailable")}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("card.nationality")}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {tenant.nationality || t("card.notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("card.hometown")}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {tenant.home || t("card.notAvailable")}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 pt-2 border-t border-border text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>
                {t("card.joined")} {formatDate(tenant.createdAt)}
              </span>
            </div>

            {/* Action Buttons - Only visible when accordion is open */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                onClick={handleToggleStatus}
                className={cn(
                  "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                    : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Power className="w-4 h-4" />
                  <span>
                    {isPending ? (
                      <SpinIcon />
                    ) : isActive ? (
                      t("card.deactivate")
                    ) : (
                      t("card.activate")
                    )}
                  </span>
                </div>
              </button>
              <TenantDeleteButton data={tenant} isLoading={isPending} />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TenantCard;
