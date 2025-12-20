import { Car } from '@/types/simulation';
import { CarComponent } from './Car';
import { ParkingSquare } from 'lucide-react';

interface ParkingSlotProps {
  index: number;
  car?: Car;
}

export function ParkingSlot({ index, car }: ParkingSlotProps) {
  return (
    <div
      className={`
        relative
        w-20 h-24
        rounded-xl
        border-2 border-dashed
        flex flex-col items-center justify-center
        transition-all duration-500
        ${car 
          ? 'border-success bg-success/10' 
          : 'border-muted-foreground/30 bg-secondary/30'
        }
      `}
    >
      <span className="absolute top-1 left-2 text-xs font-mono text-muted-foreground">
        P{index + 1}
      </span>
      
      {car ? (
        <CarComponent car={car} size="md" />
      ) : (
        <ParkingSquare className="w-8 h-8 text-muted-foreground/40" />
      )}
    </div>
  );
}
