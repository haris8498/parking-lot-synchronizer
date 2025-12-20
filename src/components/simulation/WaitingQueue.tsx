import { Car } from '@/types/simulation';
import { CarComponent } from './Car';
import { ArrowRight, AlertTriangle, MousePointerClick } from 'lucide-react';

interface WaitingQueueProps {
  cars: Car[];
  onRemoveCar?: (carId: string) => void;
  onSelectCar?: (car: Car) => void;
  selectedCarId?: string;
}

export function WaitingQueue({ cars, onRemoveCar, onSelectCar, selectedCarId }: WaitingQueueProps) {
  const hasBlockedCars = cars.some(c => c.state === 'blocked');

  return (
    <div className="glass-panel p-5 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-foreground">Waiting Queue</span>
        {hasBlockedCars && (
          <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
        )}
        <span className="ml-auto text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {cars.length} cars
        </span>
      </div>
      
      <div className="flex items-center gap-3 min-h-[80px] overflow-x-auto pb-2 px-1">
        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-4 text-muted-foreground">
            <MousePointerClick className="w-6 h-6 mb-2 opacity-50" />
            <span className="text-xs italic">Click "+ Car" to add vehicles</span>
          </div>
        ) : (
          <>
            {cars.map((car, i) => (
              <div 
                key={car.id} 
                className="flex items-center gap-2 animate-slide-up" 
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <CarComponent 
                  car={car} 
                  size="sm" 
                  onClick={() => onSelectCar?.(car)}
                  onRemove={() => onRemoveCar?.(car.id)}
                  isSelected={selectedCarId === car.id}
                />
                {i < cars.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                )}
              </div>
            ))}
            <div className="flex items-center gap-2 pl-2">
              <ArrowRight className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-xs text-primary font-mono">GATE</span>
            </div>
          </>
        )}
      </div>

      {cars.length > 0 && (
        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
          <MousePointerClick className="w-3 h-3" />
          Hover over cars to remove them from queue
        </p>
      )}
    </div>
  );
}
