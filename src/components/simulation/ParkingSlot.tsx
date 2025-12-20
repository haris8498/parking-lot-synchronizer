import { Car } from '@/types/simulation';
import { CarComponent } from './Car';
import { ParkingSquare, MousePointerClick } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ParkingSlotProps {
  index: number;
  car?: Car;
  onRemoveCar?: () => void;
  onSelectCar?: (car: Car) => void;
  isSelected?: boolean;
}

export function ParkingSlot({ index, car, onRemoveCar, onSelectCar, isSelected }: ParkingSlotProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`
            relative group
            w-24 h-28
            rounded-xl
            border-2 border-dashed
            flex flex-col items-center justify-center
            transition-all duration-500
            cursor-pointer
            ${car 
              ? 'border-success bg-success/10 hover:bg-success/20' 
              : 'border-muted-foreground/30 bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50'
            }
            ${isSelected ? 'ring-2 ring-primary' : ''}
          `}
          onClick={() => {
            if (car && onRemoveCar) {
              onRemoveCar();
            }
          }}
        >
          <span className="absolute top-1.5 left-2.5 text-xs font-mono font-bold text-muted-foreground">
            P{index + 1}
          </span>
          
          {car ? (
            <div className="mt-2">
              <CarComponent 
                car={car} 
                size="md" 
                onClick={() => onSelectCar?.(car)}
                isSelected={isSelected}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-70 transition-opacity">
              <ParkingSquare className="w-8 h-8 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Empty</span>
            </div>
          )}

          {/* Click hint for occupied slots */}
          {car && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <MousePointerClick className="w-3 h-3 text-success" />
              <span className="text-[9px] text-success">Click to exit</span>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {car ? `Click to remove ${car.name}` : 'Empty slot'}
      </TooltipContent>
    </Tooltip>
  );
}
