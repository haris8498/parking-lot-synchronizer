import { Semaphores } from '@/types/simulation';
import { Lock, Unlock, ParkingCircle, Car } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SemaphorePanelProps {
  semaphores: Semaphores;
  capacity: number;
  chaosMode: boolean;
}

const semaphoreInfo = {
  mutex: {
    icon: Lock,
    unlockIcon: Unlock,
    label: 'Mutex',
    description: 'Controls exclusive access to the gate. Only one car can pass at a time.',
    color: 'primary',
  },
  empty: {
    icon: ParkingCircle,
    unlockIcon: ParkingCircle,
    label: 'Empty',
    description: 'Counts available parking slots. wait(empty) blocks when all slots are taken.',
    color: 'success',
  },
  full: {
    icon: Car,
    unlockIcon: Car,
    label: 'Full',
    description: 'Counts occupied parking slots. wait(full) blocks when no cars are parked.',
    color: 'accent',
  },
};

export function SemaphorePanel({ semaphores, capacity, chaosMode }: SemaphorePanelProps) {
  return (
    <div className="glass-panel p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Semaphores</h3>
        {chaosMode && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-mono animate-pulse">
            DISABLED
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {(Object.keys(semaphores) as Array<keyof Semaphores>).map((key) => {
          const info = semaphoreInfo[key];
          const value = semaphores[key];
          const isBlocked = value === 0;
          const Icon = isBlocked && key === 'mutex' ? info.icon : info.unlockIcon;
          
          return (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <div 
                  className={`
                    flex items-center gap-3 p-3 rounded-lg
                    transition-all duration-300
                    ${isBlocked 
                      ? 'bg-destructive/10 border border-destructive/30' 
                      : 'bg-secondary/50 border border-border/30'
                    }
                    ${chaosMode ? 'opacity-40' : ''}
                    cursor-help
                  `}
                >
                  <div className={`
                    p-2 rounded-lg 
                    ${isBlocked ? 'bg-destructive/20' : `bg-${info.color}/20`}
                  `}>
                    <Icon className={`w-4 h-4 ${isBlocked ? 'text-destructive' : `text-${info.color}`}`} />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{info.label}</p>
                    <p className={`text-lg font-mono font-bold ${isBlocked ? 'text-destructive' : 'text-foreground'}`}>
                      {key === 'empty' ? `${value}/${capacity}` : value}
                    </p>
                  </div>
                  
                  {isBlocked && (
                    <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="glass-panel border-border max-w-[200px]">
                <p className="text-sm">{info.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
