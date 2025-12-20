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
  StepForward,
  AlertTriangle,
  Zap,
  Car
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ControlPanelProps {
  isRunning: boolean;
  speed: number;
  capacity: number;
  chaosMode: boolean;
  stepMode: boolean;
  autoSpawn: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onAddCar: () => void;
  onRemoveCar: () => void;
  onSpeedChange: (speed: number) => void;
  onCapacityChange: (capacity: number) => void;
  onToggleChaosMode: () => void;
  onToggleStepMode: () => void;
  onToggleAutoSpawn: () => void;
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
  autoSpawn,
  onToggleRunning,
  onReset,
  onAddCar,
  onRemoveCar,
  onSpeedChange,
  onCapacityChange,
  onToggleChaosMode,
  onToggleStepMode,
  onToggleAutoSpawn,
  onStep,
  parkedCount,
  waitingCount,
}: ControlPanelProps) {
  return (
    <div className="glass-panel p-5 rounded-xl space-y-5">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        Controls
      </h3>
      
      {/* Main Controls */}
      <div className="grid grid-cols-2 gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={onAddCar}
              className="gap-1.5 h-10"
            >
              <Plus className="w-4 h-4" />
              <Car className="w-4 h-4" />
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
              className="gap-1.5 h-10"
            >
              <Minus className="w-4 h-4" />
              <Car className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove a parked car (Consumer)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={onToggleRunning}
              disabled={stepMode}
              className="gap-1.5 h-10"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isRunning ? 'Pause simulation' : 'Start auto-processing'}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-1.5 h-10"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset the simulation</TooltipContent>
        </Tooltip>
      </div>

      {/* Step Button */}
      {stepMode && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={onStep}
              className="w-full gap-2 h-10"
              disabled={waitingCount === 0}
            >
              <StepForward className="w-4 h-4" />
              Process Next Car
            </Button>
          </TooltipTrigger>
          <TooltipContent>Process one car from the queue</TooltipContent>
        </Tooltip>
      )}

      {/* Speed & Capacity */}
      <div className="space-y-4 pt-2 border-t border-border">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs text-muted-foreground">Speed</Label>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{speed}x</span>
          </div>
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
          <Label className="text-xs text-muted-foreground">Parking Capacity</Label>
          <Input
            type="number"
            value={capacity}
            onChange={(e) => onCapacityChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            min={1}
            max={10}
            className="h-9"
          />
        </div>
      </div>

      {/* Mode Toggles */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className={`w-4 h-4 ${autoSpawn ? 'text-success' : 'text-muted-foreground'}`} />
            <Label className="text-sm cursor-pointer" htmlFor="auto-spawn">Auto Spawn</Label>
          </div>
          <Switch
            id="auto-spawn"
            checked={autoSpawn}
            onCheckedChange={onToggleAutoSpawn}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StepForward className={`w-4 h-4 ${stepMode ? 'text-primary' : 'text-muted-foreground'}`} />
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
            <AlertTriangle className={`w-4 h-4 ${chaosMode ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
            <Label className="text-sm cursor-pointer" htmlFor="chaos-mode">
              Chaos Mode
            </Label>
          </div>
          <Switch
            id="chaos-mode"
            checked={chaosMode}
            onCheckedChange={onToggleChaosMode}
          />
        </div>
        {chaosMode && (
          <p className="text-[10px] text-destructive/80 pl-6">
            ⚠️ Semaphores disabled! Race conditions may occur.
          </p>
        )}
      </div>
    </div>
  );
}
