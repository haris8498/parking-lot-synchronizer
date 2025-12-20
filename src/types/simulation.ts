export type CarState = 'entering' | 'waiting' | 'blocked' | 'parked' | 'exiting';

export interface Car {
  id: string;
  state: CarState;
  slotIndex?: number;
  color: string;
  name?: string;
}

export interface Semaphores {
  mutex: number;
  empty: number;
  full: number;
}

export interface SimulationEvent {
  id: string;
  timestamp: Date;
  type: 'wait' | 'signal';
  semaphore: 'mutex' | 'empty' | 'full';
  carId: string;
  blocked?: boolean;
}

export interface SimulationState {
  cars: Car[];
  parkedCars: Car[];
  waitingCars: Car[];
  exitingCars: Car[];
  semaphores: Semaphores;
  events: SimulationEvent[];
  capacity: number;
  isRunning: boolean;
  speed: number;
  chaosMode: boolean;
  stepMode: boolean;
}
