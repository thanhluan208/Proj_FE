import BillingManagementSection from "./components/billing/BillingManagementSection";
import ContractManagementSection from "./components/contract/ContractManagementSection";
import ExpenseManagementSection from "./components/room-expense/ExpenseManagementSection";
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
      <div className="lg:max-w-[calc(100vw-336px)] mx-auto space-y-6 max-w-[calc(100vw-112px)]">
        <RoomInfoSection />

        <TenantManagementSection roomId={id} />

        <BillingManagementSection roomId={id} />

        <ExpenseManagementSection roomId={id} />

        <ContractManagementSection roomId={id} />
      </div>
    </div>
  );
};

export default RoomDetailPage;
