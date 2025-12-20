import { Car, Zap } from 'lucide-react';

interface SimulationHeaderProps {
  chaosMode: boolean;
}

export function SimulationHeader({ chaosMode }: SimulationHeaderProps) {
  return (
    <header className="text-center space-y-2">
      <div className="flex items-center justify-center gap-3">
        <Car className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold gradient-text">
          Producer-Consumer Simulation
        </h1>
        <Car className="w-8 h-8 text-primary transform -scale-x-100" />
      </div>
      
      <p className="text-muted-foreground text-sm max-w-xl mx-auto">
        Visualizing semaphore synchronization through a car parking analogy.
        Cars enter (producers) and exit (consumers) through a controlled gate.
      </p>

      {chaosMode && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/40 animate-pulse">
          <Zap className="w-4 h-4 text-destructive" />
          <span className="text-sm font-semibold text-destructive">
            CHAOS MODE ACTIVE - Semaphores Disabled!
          </span>
          <Zap className="w-4 h-4 text-destructive" />
        </div>
      )}
    </header>
  );
}
