import { useSimulation } from '@/hooks/useSimulation';
import { SimulationHeader } from './simulation/SimulationHeader';
import { ControlPanel } from './simulation/ControlPanel';
import { SemaphorePanel } from './simulation/SemaphorePanel';
import { WaitingQueue } from './simulation/WaitingQueue';
import { ParkingArea } from './simulation/ParkingArea';
import { EventLog } from './simulation/EventLog';
import { Legend } from './simulation/Legend';

export function ParkingSimulation() {
  const {
    state,
    addCar,
    removeCar,
    toggleRunning,
    reset,
    setSpeed,
    setCapacity,
    toggleChaosMode,
    toggleStepMode,
    step,
  } = useSimulation(5);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <SimulationHeader chaosMode={state.chaosMode} />

        <Legend />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Controls & Semaphores */}
          <aside className="lg:col-span-3 space-y-4">
            <ControlPanel
              isRunning={state.isRunning}
              speed={state.speed}
              capacity={state.capacity}
              chaosMode={state.chaosMode}
              stepMode={state.stepMode}
              onToggleRunning={toggleRunning}
              onReset={reset}
              onAddCar={addCar}
              onRemoveCar={removeCar}
              onSpeedChange={setSpeed}
              onCapacityChange={setCapacity}
              onToggleChaosMode={toggleChaosMode}
              onToggleStepMode={toggleStepMode}
              onStep={step}
              parkedCount={state.parkedCars.length}
              waitingCount={state.waitingCars.length}
            />

            <SemaphorePanel
              semaphores={state.semaphores}
              capacity={state.capacity}
              chaosMode={state.chaosMode}
            />
          </aside>

          {/* Center - Main Simulation */}
          <main className="lg:col-span-6 space-y-4">
            <WaitingQueue cars={state.waitingCars} />
            <ParkingArea
              capacity={state.capacity}
              parkedCars={state.parkedCars}
              exitingCars={state.exitingCars}
            />
          </main>

          {/* Right Panel - Event Log */}
          <aside className="lg:col-span-3">
            <EventLog events={state.events} />
          </aside>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          <p>
            <strong className="text-primary">Producer:</strong> Cars entering the parking •{' '}
            <strong className="text-primary">Consumer:</strong> Cars exiting the parking •{' '}
            <strong className="text-primary">Mutex:</strong> Gate access control •{' '}
            <strong className="text-primary">Semaphores:</strong> Slot availability tracking
          </p>
        </footer>
      </div>
    </div>
  );
}
