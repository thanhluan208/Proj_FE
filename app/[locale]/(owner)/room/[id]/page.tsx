import React, { FC } from "react";
import RoomInfoSection from "./components/room-info/RoomInfoSection";
import { mockTenants } from "./mockData";
import BillingHistorySection from "./components/billing/BillingHistorySection";
import TenantManagementSection from "./components/tenant/TenantManagementSection";

interface RoomDetailPageProps {
  params: {
    id: string;
  };
}

const RoomDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const tenants = mockTenants;

  return (
    <div className="flex-1 mx-auto pb-8 px-4 space-y-8">
      <div className="max-w-[calc(100vw-364px)] mx-auto space-y-6">
        <RoomInfoSection />

        <TenantManagementSection tenants={tenants} roomId={id} />

        <BillingHistorySection billings={[]} tenants={tenants} />
      </div>
    </div>
  );
};

export default RoomDetailPage;
