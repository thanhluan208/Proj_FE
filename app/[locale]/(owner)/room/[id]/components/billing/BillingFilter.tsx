"use client";

import React, { useState } from "react";
import { X, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface BillingFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  tenants: Array<{ id: string; name: string }>;
}

export interface FilterValues {
  tenantId?: string;
  dateFrom?: string;
  dateTo?: string;
}

const BillingFilter: React.FC<BillingFilterProps> = ({
  isOpen,
  onClose,
  onApply,
  tenants,
}) => {
  const [tenantId, setTenantId] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const handleApply = () => {
    onApply({
      tenantId: tenantId || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setTenantId("");
    setDateFrom("");
    setDateTo("");
    onApply({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card shadow-2xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-xl font-bold text-foreground">Filters</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Filter Options */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Tenant Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <User className="w-4 h-4" />
                Tenant
              </label>
              <select
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              >
                <option value="">All Tenants</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Calendar className="w-4 h-4" />
                Date Range
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border space-y-3">
            <button
              onClick={handleApply}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/80 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingFilter;
