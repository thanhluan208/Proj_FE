"use client";

import React, { useEffect, useState } from "react";
import {
  House,
  Room,
  MonthlyFinancial,
  getHouseDetail,
  getRooms,
  getFinancialSummary,
} from "./mock-data";
import HouseInfoCard from "./components/HouseInfoCard";
import FinancialSummary from "./components/FinancialSummary";
import { Loader2 } from "lucide-react";
import RoomList from "./components/room-list/RoomList";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function HouseDetailPage({ params }: PageProps) {
  const [house, setHouse] = useState<House | null>(null);
  const [financials, setFinancials] = useState<MonthlyFinancial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [houseData, roomsData, financialData] = await Promise.all([
          getHouseDetail(params.slug),
          getRooms(params.slug),
          getFinancialSummary(params.slug),
        ]);

        setHouse(houseData);
        setFinancials(financialData);
      } catch (error) {
        console.error("Failed to fetch house details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  if (loading) {
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
