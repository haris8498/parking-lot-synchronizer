import { Car } from '@/types/simulation';
import { X, Car as CarIcon, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StateBadge } from './StateBadge';

interface CarDetailsPanelProps {
  car: Car;
  onClose: () => void;
}

export function CarDetailsPanel({ car, onClose }: CarDetailsPanelProps) {
  return (
    <div 
      className="glass-panel p-4 rounded-xl animate-slide-up border-l-4"
      style={{ borderLeftColor: car.color }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center border-2"
            style={{ backgroundColor: car.color + '20', borderColor: car.color }}
          >
            <CarIcon className="w-7 h-7" style={{ color: car.color }} />
          </div>
          <div>
            <h4 className="font-semibold text-foreground" style={{ color: car.color }}>
              {car.name || 'Unknown Car'}
            </h4>
            <p className="text-xs font-mono text-muted-foreground">{car.id}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-[10px] text-muted-foreground">Status</p>
            <StateBadge state={car.state} />
          </div>
        </div>

        {car.slotIndex !== undefined && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Location</p>
              <p className="text-sm font-mono text-success">Slot P{car.slotIndex + 1}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
