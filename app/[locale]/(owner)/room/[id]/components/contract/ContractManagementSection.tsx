"use client";
import { useGetListContract } from "@/hooks/contracts/useGetListContract";
import { QueryContracts } from "@/types/contract.type";
import { FC, useMemo } from "react";

interface ContractManagementSectionProps {
  roomId: string;
}

const ContractManagementSection: FC<ContractManagementSectionProps> = ({
  roomId,
}) => {
  const filter = useMemo<QueryContracts>(() => {
    return {
      page: 1,
      pageSize: 10,
      room: roomId,
      status: "active",
    };
  }, [roomId]);

  const { data } = useGetListContract(filter);
  console.log("data", data);
  return <div>ContractManagementSection</div>;
};

export default ContractManagementSection;
