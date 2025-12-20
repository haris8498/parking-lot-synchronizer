import { CarState } from '@/types/simulation';

interface StateBadgeProps {
  state: CarState;
}

const stateConfig = {
  entering: { label: 'Entering', emoji: '🚗', color: 'bg-primary/20 text-primary' },
  waiting: { label: 'Waiting', emoji: '🟡', color: 'bg-warning/20 text-warning' },
  blocked: { label: 'Blocked', emoji: '🔴', color: 'bg-destructive/20 text-destructive' },
  parked: { label: 'Parked', emoji: '🟢', color: 'bg-success/20 text-success' },
  exiting: { label: 'Exiting', emoji: '🚙', color: 'bg-muted text-muted-foreground' },
};

export function StateBadge({ state }: StateBadgeProps) {
  const config = stateConfig[state];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}
