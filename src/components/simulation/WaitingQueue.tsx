import { Car } from '@/types/simulation';
import { CarComponent } from './Car';
import { ArrowRight, AlertTriangle } from 'lucide-react';

interface WaitingQueueProps {
  cars: Car[];
}

export function WaitingQueue({ cars }: WaitingQueueProps) {
  const hasBlockedCars = cars.some(c => c.state === 'blocked');

  return (
    <div className="glass-panel p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-muted-foreground">Waiting Queue</span>
        {hasBlockedCars && (
          <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
        )}
        <span className="ml-auto text-xs font-mono text-primary">{cars.length} cars</span>
      </div>
      
      <div className="flex items-center gap-2 min-h-[60px] overflow-x-auto pb-2">
        {cars.length === 0 ? (
          <span className="text-xs text-muted-foreground italic">No cars waiting</span>
        ) : (
          <>
            {cars.map((car, i) => (
              <div key={car.id} className="flex items-center gap-1 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <CarComponent car={car} size="sm" />
                {i < cars.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
            ))}
            <ArrowRight className="w-4 h-4 text-primary animate-pulse ml-2" />
          </>
        )}
      </div>
    </div>
  );
}
