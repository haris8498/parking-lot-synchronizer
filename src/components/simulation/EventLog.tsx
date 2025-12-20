import { SimulationEvent } from '@/types/simulation';
import { ArrowDown, ArrowUp, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EventLogProps {
  events: SimulationEvent[];
}

export function EventLog({ events }: EventLogProps) {
  const getEventIcon = (event: SimulationEvent) => {
    if (event.blocked) return <AlertCircle className="w-3 h-3 text-destructive" />;
    if (event.type === 'wait') return <ArrowDown className="w-3 h-3 text-warning" />;
    return <ArrowUp className="w-3 h-3 text-success" />;
  };

  const getEventColor = (event: SimulationEvent) => {
    if (event.blocked) return 'text-destructive';
    if (event.type === 'wait') return 'text-warning';
    return 'text-success';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="glass-panel p-4 rounded-xl h-full">
      <h3 className="text-sm font-semibold text-foreground mb-3">Event Log</h3>
      
      <ScrollArea className="h-[280px] pr-2">
        {events.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-8">
            No events yet. Add a car to start!
          </p>
        ) : (
          <div className="space-y-1">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-2 p-2 rounded-md bg-secondary/30 animate-slide-up font-mono text-xs"
              >
                {getEventIcon(event)}
                <span className="text-muted-foreground">{formatTime(event.timestamp)}</span>
                <span className={`font-semibold ${getEventColor(event)}`}>
                  {event.type}({event.semaphore})
                </span>
                {event.blocked && (
                  <span className="text-destructive ml-1">BLOCKED</span>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
