import React, { FC } from "react";
import RoomInfoSection from "./components/room-info/RoomInfoSection";
import { mockTenants } from "./mockData";
import BillingHistorySection from "./components/billing/BillingHistorySection";
import TenantManagementSection from "./components/tenant/TenantManagementSection";
import ContractManagementSection from "./components/contract/ContractManagementSection";

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
      <div className="lg:max-w-[calc(100vw-336px)] mx-auto space-y-6">
        <RoomInfoSection />

        <TenantManagementSection tenants={tenants} roomId={id} />

        <BillingHistorySection billings={[]} tenants={tenants} />

        <ContractManagementSection roomId={id} />
      </div>
    </div>
  );
};

export default RoomDetailPage;
