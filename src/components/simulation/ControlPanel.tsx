import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  Zap,
  StepForward,
  AlertTriangle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ControlPanelProps {
  isRunning: boolean;
  speed: number;
  capacity: number;
  chaosMode: boolean;
  stepMode: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onAddCar: () => void;
  onRemoveCar: () => void;
  onSpeedChange: (speed: number) => void;
  onCapacityChange: (capacity: number) => void;
  onToggleChaosMode: () => void;
  onToggleStepMode: () => void;
  onStep: () => void;
  parkedCount: number;
  waitingCount: number;
}

export function ControlPanel({
  isRunning,
  speed,
  capacity,
  chaosMode,
  stepMode,
  onToggleRunning,
  onReset,
  onAddCar,
  onRemoveCar,
  onSpeedChange,
  onCapacityChange,
  onToggleChaosMode,
  onToggleStepMode,
  onStep,
  parkedCount,
  waitingCount,
}: ControlPanelProps) {
  return (
    <div className="glass-panel p-4 rounded-xl space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Controls</h3>
      
      {/* Main Controls */}
      <div className="flex flex-wrap gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={onAddCar}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              Car
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add a car to the queue (Producer)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              onClick={onRemoveCar}
              disabled={parkedCount === 0}
              className="gap-1"
            >
              <Minus className="w-4 h-4" />
              Car
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove a parked car (Consumer)</TooltipContent>
        </Tooltip>

        <div className="w-px h-8 bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={onToggleRunning}
              disabled={stepMode}
              className="gap-1"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isRunning ? 'Pause simulation' : 'Start auto-processing'}</TooltipContent>
        </Tooltip>

        {stepMode && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onStep}
                className="gap-1"
                disabled={waitingCount === 0}
              >
                <StepForward className="w-4 h-4" />
                Step
              </Button>
            </TooltipTrigger>
            <TooltipContent>Process one car from the queue</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset the simulation</TooltipContent>
        </Tooltip>
      </div>

      {/* Speed & Capacity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Speed: {speed}x</Label>
          <Slider
            value={[speed]}
            onValueChange={([v]) => onSpeedChange(v)}
            min={0.5}
            max={3}
            step={0.5}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Capacity</Label>
          <Input
            type="number"
            value={capacity}
            onChange={(e) => onCapacityChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            min={1}
            max={10}
            className="h-8"
          />
        </div>
      </div>

      {/* Mode Toggles */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StepForward className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm cursor-pointer" htmlFor="step-mode">Step Mode</Label>
          </div>
          <Switch
            id="step-mode"
            checked={stepMode}
            onCheckedChange={onToggleStepMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${chaosMode ? 'text-destructive' : 'text-muted-foreground'}`} />
            <Label className="text-sm cursor-pointer" htmlFor="chaos-mode">
              Chaos Mode
              <span className="text-xs text-muted-foreground ml-1">(No Semaphores)</span>
            </Label>
          </div>
          <Switch
            id="chaos-mode"
            checked={chaosMode}
            onCheckedChange={onToggleChaosMode}
          />
        </div>
      </div>
    </div>
  );
}
