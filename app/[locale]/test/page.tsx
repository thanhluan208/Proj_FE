"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ComboBoxTenant from "@/components/ui/combo-box-tenant";

type SelectedTenant = {
  id: string;
  name: string;
};

export default function Page() {
  const [open, setOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<SelectedTenant | null>(
    null
  );
  const [selectedTenants, setSelectedTenants] = useState<SelectedTenant[]>([]);

  const handleSelectSingle = (tenant: SelectedTenant) => {
    setSelectedTenant(tenant);
    console.log("Selected tenant:", tenant);
  };

  const handleRemoveSingle = (id: string) => {
    setSelectedTenant(null);
    console.log("Removed tenant:", id);
  };

  const handleSelectMultiple = (tenant: SelectedTenant) => {
    setSelectedTenants((prev) => {
      const exists = prev.find((t) => t.id === tenant.id);
      if (exists) {
        return prev.filter((t) => t.id !== tenant.id);
      }
      return [...prev, tenant];
    });
    console.log("Selected tenant:", tenant);
  };

  const handleRemoveMultiple = (id: string) => {
    setSelectedTenants((prev) => prev.filter((t) => t.id !== id));
    console.log("Removed tenant:", id);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Dialog Demo */}
        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">In Dialog</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Combo-box inside a dialog
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="default">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select Tenant</DialogTitle>
                <DialogDescription>
                  Choose a tenant from the list and click to select.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <ComboBoxTenant
                  placeholder="Search tenants..."
                  roomId="room-3"
                  isMultiple={false}
                  handleSelect={(tenant) => {
                    handleSelectSingle(tenant);
                    setOpen(false);
                  }}
                  handleRemove={handleRemoveSingle}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Instructions */}
        <div className="border rounded-lg p-6 bg-blue-50 dark:bg-blue-950">
          <h3 className="font-semibold mb-2">How to test:</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Click on the combo-box button to open the dropdown</li>
            <li>
              Type in the search field to filter tenants by name or phone number
            </li>
            <li>Click on a tenant to select it (or toggle in multiple mode)</li>
            <li>Click the X icon to remove a selected tenant</li>
            <li>
              Try different search queries like "tech", "future", "555-0105"
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
