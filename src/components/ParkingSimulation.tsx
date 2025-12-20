import { useSimulation } from '@/hooks/useSimulation';
import { SimulationHeader } from './simulation/SimulationHeader';
import { ControlPanel } from './simulation/ControlPanel';
import { SemaphorePanel } from './simulation/SemaphorePanel';
import { WaitingQueue } from './simulation/WaitingQueue';
import { ParkingArea } from './simulation/ParkingArea';
import { EventLog } from './simulation/EventLog';
import { Legend } from './simulation/Legend';
import { CarDetailsPanel } from './simulation/CarDetailsPanel';

export function ParkingSimulation() {
  const {
    state,
    addCar,
    removeCar,
    removeCarFromSlot,
    removeFromQueue,
    toggleRunning,
    reset,
    setSpeed,
    setCapacity,
    toggleChaosMode,
    toggleStepMode,
    step,
    autoSpawn,
    toggleAutoSpawn,
    selectedCar,
    selectCar,
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
              autoSpawn={autoSpawn}
              onToggleRunning={toggleRunning}
              onReset={reset}
              onAddCar={addCar}
              onRemoveCar={removeCar}
              onSpeedChange={setSpeed}
              onCapacityChange={setCapacity}
              onToggleChaosMode={toggleChaosMode}
              onToggleStepMode={toggleStepMode}
              onToggleAutoSpawn={toggleAutoSpawn}
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
            <WaitingQueue 
              cars={state.waitingCars}
              onRemoveCar={removeFromQueue}
              onSelectCar={selectCar}
              selectedCarId={selectedCar?.id}
            />
            <ParkingArea
              capacity={state.capacity}
              parkedCars={state.parkedCars}
              exitingCars={state.exitingCars}
              onRemoveCarFromSlot={removeCarFromSlot}
              onSelectCar={selectCar}
              selectedCarId={selectedCar?.id}
            />

            {selectedCar && (
              <CarDetailsPanel 
                car={selectedCar} 
                onClose={() => selectCar(null)} 
              />
            )}
          </main>

          {/* Right Panel - Event Log */}
          <aside className="lg:col-span-3">
            <EventLog events={state.events} />
          </aside>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          <p>
            <strong className="text-primary">Producer:</strong> Cars entering •{' '}
            <strong className="text-primary">Consumer:</strong> Cars exiting •{' '}
            <strong className="text-primary">Mutex:</strong> Gate lock •{' '}
            <strong className="text-primary">Semaphores:</strong> Slot counters
          </p>
          <p className="mt-1 opacity-60">
            Click on cars and slots to interact • Hover for details • Toggle chaos mode to see race conditions
          </p>
        </footer>
      </div>
    </div>
  );
}
