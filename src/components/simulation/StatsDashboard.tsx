import { SimulationStats } from '@/types/simulation';
import { 
  Car, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  LogOut,
  Zap,
  BarChart3
} from 'lucide-react';

interface StatsDashboardProps {
  stats: SimulationStats;
  currentParked: number;
  currentWaiting: number;
  capacity: number;
}

export function StatsDashboard({ 
  stats, 
  currentParked, 
  currentWaiting,
  capacity 
}: StatsDashboardProps) {
  const avgWaitTime = stats.carsWithWaitTime > 0 
    ? (stats.totalWaitTime / stats.carsWithWaitTime / 1000).toFixed(1) 
    : '0.0';

  const occupancyRate = capacity > 0 
    ? Math.round((currentParked / capacity) * 100) 
    : 0;

  const statItems = [
    {
      label: 'Total Parked',
      value: stats.totalCarsParked,
      icon: Car,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Total Exited',
      value: stats.totalCarsExited,
      icon: LogOut,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Avg Wait Time',
      value: `${avgWaitTime}s`,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Blocking Events',
      value: stats.totalBlockingEvents,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Peak Occupancy',
      value: stats.peakOccupancy,
      icon: TrendingUp,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent/20',
    },
    {
      label: 'Chaos Collisions',
      value: stats.chaosCollisions,
      icon: Zap,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="glass-panel p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Statistics</h3>
      </div>

      {/* Current Status */}
      <div className="mb-4 p-3 rounded-lg bg-secondary/30 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Current Occupancy</span>
          <span className="text-sm font-mono font-bold text-primary">{occupancyRate}%</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-success via-warning to-destructive transition-all duration-500"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Parked: {currentParked}/{capacity}</span>
          <span>Waiting: {currentWaiting}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        {statItems.map((item) => (
          <div 
            key={item.label}
            className={`p-3 rounded-lg ${item.bgColor} border border-border/50 transition-all hover:scale-105`}
          >
            <div className="flex items-center gap-2 mb-1">
              <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {item.label}
              </span>
            </div>
            <p className={`text-lg font-bold font-mono ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
