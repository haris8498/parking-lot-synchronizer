import { Car } from '@/types/simulation';
import { ParkingSlot } from './ParkingSlot';
import { CarComponent } from './Car';
import { ArrowRight, DoorOpen } from 'lucide-react';

interface ParkingAreaProps {
  capacity: number;
  parkedCars: Car[];
  exitingCars: Car[];
}

export function ParkingArea({ capacity, parkedCars, exitingCars }: ParkingAreaProps) {
  const slots = Array.from({ length: capacity }, (_, i) => {
    const car = parkedCars.find(c => c.slotIndex === i);
    return { index: i, car };
  });

  return (
    <div className="glass-panel p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Parking Area</h3>
        <span className="text-xs font-mono text-primary">
          {parkedCars.length}/{capacity} occupied
        </span>
      </div>

      {/* Entry Gate */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
          <DoorOpen className="w-5 h-5 text-primary" />
          <span className="text-xs font-mono text-primary">GATE</span>
        </div>
        <ArrowRight className="w-5 h-5 text-primary animate-pulse" />
      </div>

      {/* Parking Slots */}
      <div className="flex flex-wrap gap-3">
        {slots.map(({ index, car }) => (
          <ParkingSlot key={index} index={index} car={car} />
        ))}
      </div>

      {/* Exiting Cars */}
      {exitingCars.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Exiting:</p>
          <div className="flex gap-2">
            {exitingCars.map(car => (
              <CarComponent key={car.id} car={car} size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
