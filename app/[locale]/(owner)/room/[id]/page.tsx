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
    <>
      <div className=" mx-auto space-y-6 max-w-7xl">
        <RoomInfoSection />

        <TenantManagementSection roomId={id} />

        <BillingManagementSection roomId={id} />

        <ExpenseManagementSection roomId={id} />

        <ContractManagementSection roomId={id} />
      </div>
    </>
  );
};

export default RoomDetailPage;
