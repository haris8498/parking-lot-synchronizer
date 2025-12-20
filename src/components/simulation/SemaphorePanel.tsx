import { Semaphores } from '@/types/simulation';
import { Lock, Unlock, ParkingCircle, Car, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
    fullDescription: `
      **Mutex (Mutual Exclusion)**
      
      The mutex semaphore ensures that only ONE car can enter or exit through the gate at any moment.
      
      • **Value = 1**: Gate is free, a car can proceed
      • **Value = 0**: Gate is occupied, cars must wait
      
      **Operations:**
      - wait(mutex): Car tries to acquire the gate
      - signal(mutex): Car releases the gate after passing
    `,
    color: 'primary',
  },
  empty: {
    icon: ParkingCircle,
    unlockIcon: ParkingCircle,
    label: 'Empty',
    description: 'Counts available parking slots. wait(empty) blocks when all slots are taken.',
    fullDescription: `
      **Empty Semaphore (Available Slots)**
      
      Tracks how many parking slots are currently AVAILABLE.
      
      • **Value > 0**: Slots available, cars can park
      • **Value = 0**: Parking is FULL, producers must wait
      
      **Operations:**
      - wait(empty): Decrement when a car wants to park
      - signal(empty): Increment when a car leaves
      
      This prevents more cars from entering than there are slots!
    `,
    color: 'success',
  },
  full: {
    icon: Car,
    unlockIcon: Car,
    label: 'Full',
    description: 'Counts occupied parking slots. wait(full) blocks when no cars are parked.',
    fullDescription: `
      **Full Semaphore (Occupied Slots)**
      
      Tracks how many parking slots are currently OCCUPIED.
      
      • **Value > 0**: Cars are parked, can be removed
      • **Value = 0**: Parking is EMPTY, consumers must wait
      
      **Operations:**
      - wait(full): Consumer waits for a parked car
      - signal(full): Increment when a car parks
      
      This prevents trying to remove cars when none are parked!
    `,
    color: 'accent',
  },
};

export function SemaphorePanel({ semaphores, capacity, chaosMode }: SemaphorePanelProps) {
  const [selectedSemaphore, setSelectedSemaphore] = useState<keyof typeof semaphoreInfo | null>(null);

  return (
    <>
      <div className="glass-panel p-5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Semaphores
          </h3>
          {chaosMode && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-mono animate-pulse">
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
              <div 
                key={key}
                className={`
                  flex items-center gap-3 p-3 rounded-lg
                  transition-all duration-300
                  cursor-pointer
                  hover:scale-[1.02]
                  ${isBlocked 
                    ? 'bg-destructive/10 border border-destructive/30 hover:bg-destructive/15' 
                    : 'bg-secondary/50 border border-border/30 hover:bg-secondary/70'
                  }
                  ${chaosMode ? 'opacity-40 pointer-events-none' : ''}
                `}
                onClick={() => setSelectedSemaphore(key)}
              >
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${isBlocked ? 'bg-destructive/20' : `bg-${info.color}/20`}
                `}>
                  <Icon className={`w-5 h-5 ${isBlocked ? 'text-destructive' : `text-${info.color}`}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">{info.label}</p>
                    <Info className="w-3 h-3 text-muted-foreground/50" />
                  </div>
                  <p className={`text-xl font-mono font-bold ${isBlocked ? 'text-destructive' : 'text-foreground'}`}>
                    {key === 'empty' ? `${value}/${capacity}` : value}
                  </p>
                </div>
                
                {isBlocked && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                    <span className="text-[9px] text-destructive">BLOCKED</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-muted-foreground mt-4 text-center">
          Click on any semaphore to learn more
        </p>
      </div>

      {/* Semaphore Detail Dialog */}
      <Dialog open={!!selectedSemaphore} onOpenChange={() => setSelectedSemaphore(null)}>
        <DialogContent className="glass-panel border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              {selectedSemaphore && (
                <>
                  {(() => {
                    const info = semaphoreInfo[selectedSemaphore];
                    const Icon = info.icon;
                    return <Icon className="w-5 h-5" />;
                  })()}
                  {semaphoreInfo[selectedSemaphore]?.label} Semaphore
                </>
              )}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-sm text-muted-foreground whitespace-pre-line mt-4">
                {selectedSemaphore && semaphoreInfo[selectedSemaphore].fullDescription}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
