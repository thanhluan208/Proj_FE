
export interface House {
  id: string;
  name: string;
  description?: string;
  status?: {
    id: number;
    name: string;
    color: string;
  };
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  status?: {
    id: number;
    name: string;
    color: string;
  };
  size_sq_m: number;
  base_rent: number;
  fees?: {
    electricity_price: number;
    water_price: number;
    internet_price: number;
    service_price: number;
  };
  contractDate?: number; // 1-31
}

export interface MonthlyFinancial {
  month: string; // "YYYY-MM"
  income: number;
  expense: number;
}

const MOCK_HOUSE: House = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Sunrise Apartment Complex',
  description: 'A beautiful apartment complex located in the heart of the city, featuring modern amenities and spacious rooms.',
  status: {
    id: 1,
    name: 'Active',
    color: 'bg-green-500',
  },
  createdAt: '2023-01-15T08:00:00Z',
  updatedAt: '2023-06-20T14:30:00Z',
  owner: {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  },
};

const MOCK_ROOMS: Room[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `room-${i + 1}`,
  name: `Room ${101 + i}`,
  description: `Standard room on floor ${Math.floor(i / 4) + 1}`,
  status: i % 3 === 0 ? { id: 2, name: 'Occupied', color: 'bg-blue-500' } : { id: 1, name: 'Available', color: 'bg-green-500' },
  size_sq_m: 25 + (i % 3) * 5,
  base_rent: 5000000 + (i % 3) * 500000,
  houseId: '123e4567-e89b-12d3-a456-426614174000',
  fees: {
    electricity_price: 3500,
    water_price: 20000,
    internet_price: 150000,
    service_price: 100000,
  },
  contractDate: Math.floor(Math.random() * 28) + 1, // Random date 1-28 to avoid month length issues
}));

const MOCK_FINANCIALS: MonthlyFinancial[] = [
  { month: '2024-01', income: 45000000, expense: 12000000 },
  { month: '2024-02', income: 48000000, expense: 8000000 },
  { month: '2024-03', income: 47000000, expense: 15000000 },
  { month: '2024-04', income: 50000000, expense: 9000000 },
  { month: '2024-05', income: 52000000, expense: 10000000 },
  { month: '2024-06', income: 51000000, expense: 11000000 },
  { month: '2024-07', income: 53000000, expense: 8500000 },
  { month: '2024-08', income: 55000000, expense: 13000000 },
  { month: '2024-09', income: 54000000, expense: 9500000 },
  { month: '2024-10', income: 56000000, expense: 10500000 },
  { month: '2024-11', income: 58000000, expense: 12500000 },
  { month: '2024-12', income: 60000000, expense: 14000000 },
];

export const getHouseDetail = async (id: string): Promise<House> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...MOCK_HOUSE, id };
};

export const getRooms = async (houseId: string): Promise<Room[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_ROOMS;
};

export const getFinancialSummary = async (houseId: string): Promise<MonthlyFinancial[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_FINANCIALS;
};
