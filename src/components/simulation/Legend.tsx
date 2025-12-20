import { StateBadge } from './StateBadge';
import { CarState } from '@/types/simulation';

const states: CarState[] = ['parked', 'waiting', 'blocked', 'exiting'];

export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-2 rounded-lg bg-secondary/30">
      <span className="text-xs text-muted-foreground">Legend:</span>
      {states.map((state) => (
        <StateBadge key={state} state={state} />
      ))}
    </div>
  );
}
