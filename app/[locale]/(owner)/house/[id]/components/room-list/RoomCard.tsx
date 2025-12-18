import React from "react";
import { Room } from "@/types/rooms.type";
import {
  Home,
  Ruler,
  DollarSign,
  Edit2,
  Trash2,
  Zap,
  Droplets,
  Wifi,
  Wrench,
  Calendar,
  LucideBike,
} from "lucide-react";
import { format } from "date-fns";
import { Link, useRouter } from "@/i18n/routing";
import { Routes } from "@/lib/constant";
import RoomAddOrEditButton from "./RoomAddOrEditButton";
import { useParams } from "next/navigation";

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const router = useRouter();
  const params = useParams();

  const houseId = String(params.houseId || "");

  const currentContract = room?.contracts?.[0] || {};

  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(value));
  };

  const getElectricityFee = () => {
    if (Number(currentContract.fixed_electricity_fee) > 0) {
      return `${formatCurrency(currentContract.fixed_electricity_fee || 0)}`;
    }
    return `${formatCurrency(
      currentContract.price_per_electricity_unit || 0
    )} / kWh`;
  };

  const getWaterFee = () => {
    if (Number(currentContract.fixed_water_fee) > 0) {
      return `${formatCurrency(currentContract.fixed_water_fee || 0)}`;
    }
    return `${formatCurrency(currentContract.price_per_water_unit || 0)} / m³`;
  };

  const getStatusConfig = () => {
    if (room?.contracts?.length > 0) {
      return {
        label: "Renting",
        className: "bg-green-100 text-green-700",
      };
    }

    return {
      label: "Available",
      className: "bg-yellow-100 text-yellow-700",
    };
  };

  const statusConfig = getStatusConfig();

  const renderMonthlyFee = () => {
    const feeItems = [
      {
        icon: Zap,
        label: "Electric",
        value: getElectricityFee(),
      },
      {
        icon: Droplets,
        label: "Water",
        value: getWaterFee(),
      },
      {
        icon: Wrench,
        label: "Service",
        value: formatCurrency(currentContract.living_fee || 0),
      },
      {
        icon: Wrench,
        label: "Cleaning",
        value: formatCurrency(currentContract.cleaning_fee || 0),
      },
      {
        icon: Wifi,
        label: "Internet",
        value: formatCurrency(currentContract.internet_fee || 0),
      },
      {
        icon: LucideBike,
        label: "Parking",
        value: formatCurrency(currentContract.parking_fee || 0), // <- I assume parking_fee?
      },
    ];

    return feeItems.map(({ icon: Icon, label, value }) => (
      <div
        key={label}
        className="flex items-center justify-between bg-background/50 p-2 rounded-lg"
      >
        <div className="flex items-center text-muted-foreground">
          <Icon className="w-3 h-3 mr-1.5" />
          <span>{label}</span>
        </div>
        <span className="font-medium">{value}</span>
      </div>
    ));
  };

  return (
    <div className="rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all shadow-sm duration-300 bg-accent/30 hover:bg-accent/50 group relative overflow-hidden">
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <RoomAddOrEditButton houseId={houseId} data={room} />
        <button
          className="p-1.5 hover:bg-red-100 rounded-full text-muted-foreground hover:text-red-500 transition-colors"
          title="Delete Room"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="absolute top-4 right-4 transition-opacity group-hover:opacity-0 duration-200">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig.className}`}
        >
          {statusConfig.label}
        </span>
      </div>

      <div className="flex justify-between items-start mb-2 mt-1">
        <Link
          href={Routes.room(room.id)}
          className="flex hover:underline items-center hover:text-primary transition-colors"
        >
          <Home className="w-5 h-5 text-secondary mr-2" />
          <h3 className="font-semibold">{room.name}</h3>
        </Link>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
        {room.description}
      </p>

      <div className="flex justify-between items-center text-xs mb-2">
        <div className="flex items-center text-muted-foreground">
          <Ruler className="w-3.5 h-3.5 mr-1" />
          <span>{room.size_sq_m} m²</span>
        </div>
        <div className="flex items-center font-medium text-primary">
          <DollarSign className="w-3.5 h-3.5 mr-1" />
          <span>{formatCurrency(currentContract.base_rent)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <div className="flex items-center text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 mr-1" />
          <span>Created: {format(new Date(room.createdAt), "dd/MM/yyyy")}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 mr-1" />
          <span>
            Payment date:{" "}
            {format(new Date(currentContract.startDate), "dd/MM/yyyy")}
          </span>
        </div>
      </div>

      {/* Fees Section (Expand on Hover) */}
      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
        <div className="overflow-hidden">
          <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Monthly Fees
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {renderMonthlyFee()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
