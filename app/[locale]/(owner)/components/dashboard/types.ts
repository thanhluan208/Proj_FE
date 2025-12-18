import { House } from "@/types/houses.type";
import { Room } from "@/types/rooms.type";

export interface DashboardStats {
  totalProperties: number;
  totalUnits: number;
  occupancyRate: number;
  monthlyRevenue: number;
  activeContracts: number;
}

export interface ActivityItem {
  id: string;
  type: "PAYMENT" | "NEW_CONTRACT" | "MAINTENANCE" | "EXPIRING_SOON";
  title: string;
  description: string;
  timestamp: string;
  entityId?: string; // ID of the related room/contract
}

export interface PropertySummary extends House {
  totalRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
}
