import { Car } from '@/types/simulation';
import { ParkingSlot } from './ParkingSlot';
import { CarComponent } from './Car';
import { ArrowRight, DoorOpen, ArrowLeft, Sparkles } from 'lucide-react';

interface ParkingAreaProps {
  capacity: number;
  parkedCars: Car[];
  exitingCars: Car[];
  onRemoveCarFromSlot?: (slotIndex: number) => void;
  onSelectCar?: (car: Car) => void;
  selectedCarId?: string;
}

export function ParkingArea({ 
  capacity, 
  parkedCars, 
  exitingCars, 
  onRemoveCarFromSlot,
  onSelectCar,
  selectedCarId
}: ParkingAreaProps) {
  const slots = Array.from({ length: capacity }, (_, i) => {
    const car = parkedCars.find(c => c.slotIndex === i);
    return { index: i, car };
  });

  const occupancyPercent = (parkedCars.length / capacity) * 100;

  return (
    <div className="glass-panel p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Parking Area
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-success to-primary transition-all duration-500"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-primary">
              {parkedCars.length}/{capacity}
            </span>
          </div>
        </div>
      </div>

      {/* Entry Gate */}
      <div className="flex items-center gap-4 mb-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/40">
          <DoorOpen className="w-6 h-6 text-primary" />
          <span className="text-sm font-mono font-bold text-primary">GATE</span>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Entry</span>
          <div className="flex-1" />
          <span className="text-xs text-muted-foreground">Exit</span>
          <ArrowLeft className="w-5 h-5 text-warning animate-pulse" />
        </div>
      </div>

      {/* Parking Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
        {slots.map(({ index, car }) => (
          <ParkingSlot 
            key={index} 
            index={index} 
            car={car}
            onRemoveCar={() => onRemoveCarFromSlot?.(index)}
            onSelectCar={onSelectCar}
            isSelected={car?.id === selectedCarId}
          />
        ))}
      </div>

      {/* Exiting Cars */}
      {exitingCars.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeft className="w-4 h-4 text-warning" />
            <p className="text-xs text-muted-foreground">Exiting vehicles:</p>
          </div>
          <div className="flex gap-3">
            {exitingCars.map(car => (
              <CarComponent key={car.id} car={car} size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
