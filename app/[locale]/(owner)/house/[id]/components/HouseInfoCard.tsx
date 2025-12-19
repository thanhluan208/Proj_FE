import React, { useMemo } from "react";
import { MapPin, User, Calendar, Info, Edit, Trash2 } from "lucide-react";
import { House } from "@/types/houses.type";
import { RecordStatusEnum } from "@/types";
import useUserStore from "@/stores/user-profile.store";
import AddOrEditHouseButton from "../../../components/houses/AddOrEditHouseButton";
import DeleteButton from "@/components/ui/delete-button";
import useHouseMutation from "@/hooks/houses/useHouseMutation";

interface HouseInfoCardProps {
  house: House;
}

const HouseInfoCard: React.FC<HouseInfoCardProps> = ({ house }) => {
  const profile = useUserStore((state) => state.profile);

  const { deleteHouse } = useHouseMutation();

  const statusColor = useMemo(() => {
    if (house.status.id == RecordStatusEnum.ACTIVE) {
      return "bg-green-500";
    }

    return "bg-destructive";
  }, [house.status]);

  return (
    <div className="bg-card  text-card-foreground rounded-2xl shadow-md p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{house.name}</h1>
          <div className="flex items-start mt-2 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{house.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColor}`}
          >
            {house.status?.name || "Unknown"}
          </div>
          {house?.id && <AddOrEditHouseButton data={house} />}
          <DeleteButton
            id={house.id}
            action={deleteHouse}
            title="Delete house"
            description="Are you sure you want to delete this house?"
            buttonContent={<Trash2 className="w-4 h-4 text-destructive" />}
            content="Delete this house will result in lost access to all information related to rooms, tenants, contracts and bills"
            className="w-fit"
            enableConfirmText
          />
        </div>
      </div>

      <p className="text-muted-foreground mb-6">{house.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center p-3 bg-accent rounded-lg">
          <User className="w-5 h-5 text-primary mr-3" />
          <div>
            <p className="text-xs text-muted-foreground">Owner</p>
            <p className="font-medium">
              {profile ? `${profile.fullName} ` : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-accent rounded-lg">
          <Calendar className="w-5 h-5 text-primary mr-3" />
          <div>
            <p className="text-xs text-muted-foreground">Created At</p>
            <p className="font-medium">
              {new Date(house.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseInfoCard;
