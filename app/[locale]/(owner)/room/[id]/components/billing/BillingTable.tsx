import React from "react";
import { Billing, BillingStatusEnum } from "@/types/billing.type";
import { format } from "date-fns";

interface BillingTableProps {
  billings: Billing[];
}

const BillingTable: React.FC<BillingTableProps> = ({ billings }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getStatusConfig = (status: BillingStatusEnum) => {
    switch (status) {
      case BillingStatusEnum.PAID:
        return {
          label: "Paid",
          className:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        };
      case BillingStatusEnum.PENDING_TENANT_PAYMENT:
        return {
          label: "Pending Payment",
          className:
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        };
      case BillingStatusEnum.PENDING_OWNER_REVIEW:
        return {
          label: "Pending Review",
          className:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        };
      default:
        return {
          label: "Unknown",
          className:
            "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        };
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-auto rounded-xl border border-border">
      <table className="min-w-max w-full">
        <thead className="bg-accent/50 dark:bg-accent/30">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
              Month
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
              Tenant
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
              Electricity
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
              Water
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
              Living
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
              Parking
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
              Cleaning
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
              Base Rent
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
              Total
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
              Payment Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {billings.map((billing) => {
            const statusConfig = getStatusConfig(billing.status);
            return (
              <tr
                key={billing.id}
                className="hover:bg-accent/30 dark:hover:bg-accent/20 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">
                    {format(new Date(billing.month), "MMM yyyy")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(billing.createdAt), "dd/MM/yyyy")}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">
                    {billing.tenant.name}
                  </div>
                  {billing.tenant.email && (
                    <div className="text-xs text-muted-foreground">
                      {billing.tenant.email}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">
                    {formatCurrency(billing.total_electricity_cost)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {billing.electricity_start_index} →{" "}
                    {billing.electricity_end_index} kWh
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">
                    {formatCurrency(billing.total_water_cost)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {billing.water_start_index} → {billing.water_end_index} m³
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                  {formatCurrency(billing.total_living_cost)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                  {formatCurrency(billing.total_parking_cost)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                  {formatCurrency(billing.total_cleaning_cost)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {formatCurrency(billing.base_rent)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-primary">
                  {formatCurrency(billing.total_amount)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig.className}`}
                  >
                    {statusConfig.label}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-foreground">
                  {billing.payment_date
                    ? format(new Date(billing.payment_date), "dd/MM/yyyy")
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BillingTable;
