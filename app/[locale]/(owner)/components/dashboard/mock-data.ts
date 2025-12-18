import { ActivityItem, DashboardStats, PropertySummary } from "./types";

export const MOCK_STATS: DashboardStats = {
  totalProperties: 3,
  totalUnits: 45,
  occupancyRate: 85,
  monthlyRevenue: 156000000, // 156 million VND
  activeContracts: 38,
};

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "PAYMENT",
    title: "Room 101 - Payment Received",
    description: "Rent for December 2025 paid by Nguyen Van A",
    timestamp: "2025-12-18T10:30:00Z",
  },
  {
    id: "2",
    type: "NEW_CONTRACT",
    title: "New Contract Signed",
    description: "Room 205 - Contract signed with Tran Thi B",
    timestamp: "2025-12-17T15:45:00Z",
  },
  {
    id: "3",
    type: "MAINTENANCE",
    title: "AC Maintenance Required",
    description: "Room 302 reported AC issue",
    timestamp: "2025-12-17T09:20:00Z",
  },
  {
    id: "4",
    type: "EXPIRING_SOON",
    title: "Contract Expiring",
    description: "Room 105 - Contract expires in 7 days",
    timestamp: "2025-12-16T14:00:00Z",
  },
];

export const MOCK_PROPERTIES: PropertySummary[] = [
  {
    id: "h1",
    name: "Sunrise Apartments",
    description: "Luxury apartments in District 1",
    address: "123 Nguyen Hue, D1, HCMC",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    totalRooms: 15,
    occupiedRooms: 14,
    maintenanceRooms: 0,
  },
  {
    id: "h2",
    name: "Green Valley Villa",
    description: "Quite villa in Thao Dien",
    address: "45 Thao Dien, D2, HCMC",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
    totalRooms: 10,
    occupiedRooms: 8,
    maintenanceRooms: 1,
  },
  {
    id: "h3",
    name: "Student Dorm A",
    description: "Affordable housing for students",
    address: "789 Le Van Viet, D9, HCMC",
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-01"),
    totalRooms: 20,
    occupiedRooms: 16,
    maintenanceRooms: 2,
  },
];
