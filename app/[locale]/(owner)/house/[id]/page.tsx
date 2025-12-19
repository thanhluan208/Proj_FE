"use client";

import { useGetHouseDetail } from "@/hooks/houses/useGetHouseDetail";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import FinancialSummary from "./components/FinancialSummary";
import HouseInfoCard from "./components/HouseInfoCard";
import RoomList from "./components/room-list/RoomList";
import { MonthlyFinancial } from "./mock-data";
import { useParams } from "next/navigation";

export default function HouseDetailPage() {
  const [financials, setFinancials] = useState<MonthlyFinancial[]>([]);
  const params = useParams();

  const { data: house, isFetching } = useGetHouseDetail(String(params.id));

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!house) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">House not found.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 mx-auto pb-8 px-4 space-y-8">
      <HouseInfoCard house={house} />
      <RoomList />
      <FinancialSummary data={financials} />
    </div>
  );
}
