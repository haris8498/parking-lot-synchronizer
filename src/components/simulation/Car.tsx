import { Car as CarType } from '@/types/simulation';
import { Car as CarIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CarProps {
  car: CarType;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const stateDescriptions = {
  entering: 'Car is entering the parking area',
  waiting: 'Car is waiting at the gate',
  blocked: 'Car is blocked - parking is full!',
  parked: 'Car is safely parked',
  exiting: 'Car is leaving the parking',
};

export function CarComponent({ car, size = 'md' }: CarProps) {
  const getStateClasses = () => {
    switch (car.state) {
      case 'entering':
        return 'animate-car-enter';
      case 'waiting':
        return 'animate-car-wait';
      case 'blocked':
        return 'animate-pulse-glow';
      case 'parked':
        return 'animate-car-park';
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
            ${sizeClasses[size]}
            ${getStateClasses()}
            ${getGlowClass()}
            flex items-center justify-center
            rounded-lg
            transition-all duration-300
            cursor-pointer
            hover:scale-110
          `}
          style={{ backgroundColor: car.color + '20', borderColor: car.color }}
        >
          <CarIcon
            className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-10 h-10'}`}
            style={{ color: car.color }}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent className="glass-panel border-border">
        <p className="font-mono text-xs">{car.id.slice(0, 12)}...</p>
        <p className="text-sm mt-1">{stateDescriptions[car.state]}</p>
      </TooltipContent>
    </Tooltip>
  );
}
