import BillingHistorySection from "./components/billing/BillingHistorySection";
import ContractManagementSection from "./components/contract/ContractManagementSection";
import RoomInfoSection from "./components/room-info/RoomInfoSection";
import TenantManagementSection from "./components/tenant/TenantManagementSection";

const RoomDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div className="flex-1 mx-auto pb-8 px-4 space-y-8">
      <div className="lg:max-w-[calc(100vw-336px)] mx-auto space-y-6">
        <RoomInfoSection />

        <TenantManagementSection roomId={id} />

        {/* <BillingHistorySection billings={[]}  /> */}

        <ContractManagementSection roomId={id} />
      </div>
    </div>
  );
};

export default RoomDetailPage;
