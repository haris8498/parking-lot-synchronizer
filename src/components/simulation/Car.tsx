import { Car as CarType } from '@/types/simulation';
import { Car as CarIcon, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CarProps {
  car: CarType;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onRemove?: () => void;
  isSelected?: boolean;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
};

const iconSizes = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const stateDescriptions = {
  entering: 'Car is entering the parking area',
  waiting: 'Car is waiting at the gate',
  blocked: 'Car is blocked - parking is full!',
  parked: 'Car is safely parked',
  exiting: 'Car is leaving the parking',
};

export function CarComponent({ car, size = 'md', onClick, onRemove, isSelected }: CarProps) {
  const getStateClasses = () => {
    switch (car.state) {
      case 'entering':
        return 'animate-car-enter';
      case 'waiting':
        return 'animate-car-wait';
      case 'blocked':
        return 'animate-pulse-glow';
      case 'parked':
        return '';
      case 'exiting':
        return 'animate-car-exit';
      default:
        return '';
    }
  };

  const getGlowClass = () => {
    switch (car.state) {
      case 'waiting':
        return 'neon-glow-amber';
      case 'blocked':
        return 'neon-glow-red';
      case 'parked':
        return 'neon-glow-green';
      default:
        return 'neon-glow-cyan';
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`
            relative group
            ${sizeClasses[size]}
            ${getStateClasses()}
            ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
            flex items-center justify-center
            rounded-xl
            transition-all duration-300
            cursor-pointer
            hover:scale-110
            hover:z-10
            border-2
          `}
          style={{ 
            backgroundColor: car.color + '20', 
            borderColor: car.color,
            boxShadow: `0 0 15px ${car.color}40`
          }}
          onClick={onClick}
        >
          <CarIcon
            className={`${iconSizes[size]} transition-transform group-hover:scale-110`}
            style={{ color: car.color }}
          />
          
          {/* Remove button for waiting cars */}
          {onRemove && car.state === 'waiting' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {/* Name label */}
          {car.name && size !== 'sm' && (
            <span 
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap"
              style={{ color: car.color }}
            >
              {car.name}
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="glass-panel border-border">
        <div className="space-y-1">
          <p className="font-semibold" style={{ color: car.color }}>{car.name || 'Car'}</p>
          <p className="text-xs text-muted-foreground">{stateDescriptions[car.state]}</p>
          <p className="font-mono text-xs opacity-60">{car.id.slice(0, 16)}...</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
