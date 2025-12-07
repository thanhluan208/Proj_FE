import React from 'react';
import { House } from '../mock-data';
import { MapPin, User, Calendar, Info, Edit, Trash2 } from 'lucide-react';

interface HouseInfoCardProps {
  house: House;
}

const HouseInfoCard: React.FC<HouseInfoCardProps> = ({ house }) => {
  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-md p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{house.name}</h1>
          <div className="flex items-center mt-2 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>123 Main St, Cityville (Mock Address)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${house.status?.color || 'bg-gray-500'}`}>
            {house.status?.name || 'Unknown'}
          </div>
          <button className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-primary" title="Edit House">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-red-100 rounded-full transition-colors text-muted-foreground hover:text-red-500" title="Delete House">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-muted-foreground mb-6">{house.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center p-3 bg-accent rounded-lg">
          <User className="w-5 h-5 text-primary mr-3" />
          <div>
            <p className="text-xs text-muted-foreground">Owner</p>
            <p className="font-medium">{house.owner ? `${house.owner.firstName} ${house.owner.lastName}` : 'N/A'}</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-accent rounded-lg">
          <Calendar className="w-5 h-5 text-primary mr-3" />
          <div>
            <p className="text-xs text-muted-foreground">Created At</p>
            <p className="font-medium">{new Date(house.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseInfoCard;
