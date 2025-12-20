import { useState, useCallback, useRef, useEffect } from 'react';
import { Car, Semaphores, SimulationEvent, SimulationState, CarState } from '@/types/simulation';

const CAR_COLORS = [
  '#00d9ff', // cyan
  '#ff6b9d', // pink
  '#00ff88', // green
  '#ffb800', // amber
  '#ff4757', // red
  '#a55eea', // purple
  '#2ed573', // lime
  '#ff7f50', // coral
];

const generateCarId = () => `car-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getRandomColor = () => CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];

export function useSimulation(initialCapacity = 5) {
  const [state, setState] = useState<SimulationState>({
    cars: [],
    parkedCars: [],
    waitingCars: [],
    exitingCars: [],
    semaphores: {
      mutex: 1,
      empty: initialCapacity,
      full: 0,
    },
    events: [],
    capacity: initialCapacity,
    isRunning: false,
    speed: 1,
    chaosMode: false,
    stepMode: false,
  });

  const processingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addEvent = useCallback((
    type: 'wait' | 'signal',
    semaphore: 'mutex' | 'empty' | 'full',
    carId: string,
    blocked = false
  ) => {
    const event: SimulationEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date(),
      type,
      semaphore,
      carId,
      blocked,
    };
    setState(prev => ({
      ...prev,
      events: [event, ...prev.events].slice(0, 50),
    }));
  }, []);

  const processQueue = useCallback(() => {
    if (processingRef.current) return;
    processingRef.current = true;

    setState(prev => {
      const { waitingCars, parkedCars, semaphores, capacity, chaosMode } = prev;
      
      if (waitingCars.length === 0) {
        processingRef.current = false;
        return prev;
      }

      const nextCar = waitingCars[0];
      
      if (chaosMode) {
        // In chaos mode, cars try to park without proper synchronization
        if (parkedCars.length < capacity) {
          const slotIndex = parkedCars.length;
          const updatedCar: Car = { ...nextCar, state: 'parked', slotIndex };
          
          return {
            ...prev,
            waitingCars: waitingCars.slice(1),
            parkedCars: [...parkedCars, updatedCar],
          };
        }
        return prev;
      }

      // Proper semaphore logic
      if (semaphores.empty <= 0) {
        // No slots available, car stays blocked
        if (nextCar.state !== 'blocked') {
          addEvent('wait', 'empty', nextCar.id, true);
          const updatedWaiting = waitingCars.map((c, i) => 
            i === 0 ? { ...c, state: 'blocked' as CarState } : c
          );
          processingRef.current = false;
          return { ...prev, waitingCars: updatedWaiting };
        }
        processingRef.current = false;
        return prev;
      }

      // wait(empty) - decrement empty
      addEvent('wait', 'empty', nextCar.id);
      
      // wait(mutex) - acquire lock
      if (semaphores.mutex <= 0) {
        addEvent('wait', 'mutex', nextCar.id, true);
        processingRef.current = false;
        return prev;
      }
      addEvent('wait', 'mutex', nextCar.id);

      // Find available slot
      const occupiedSlots = new Set(parkedCars.map(c => c.slotIndex));
      let slotIndex = 0;
      while (occupiedSlots.has(slotIndex)) {
        slotIndex++;
      }

      const updatedCar: Car = { ...nextCar, state: 'parked', slotIndex };

      // signal(mutex) - release lock
      addEvent('signal', 'mutex', nextCar.id);
      
      // signal(full) - increment full
      addEvent('signal', 'full', nextCar.id);

      processingRef.current = false;
      return {
        ...prev,
        waitingCars: waitingCars.slice(1),
        parkedCars: [...parkedCars, updatedCar],
        semaphores: {
          mutex: 1,
          empty: semaphores.empty - 1,
          full: semaphores.full + 1,
        },
      };
    });

    processingRef.current = false;
  }, [addEvent]);

  const addCar = useCallback(() => {
    const newCar: Car = {
      id: generateCarId(),
      state: 'waiting',
      color: getRandomColor(),
    };

    setState(prev => ({
      ...prev,
      waitingCars: [...prev.waitingCars, newCar],
    }));
  }, []);

  const removeCar = useCallback(() => {
    setState(prev => {
      const { parkedCars, semaphores, chaosMode } = prev;
      
      if (parkedCars.length === 0) return prev;

      const exitingCar = parkedCars[0];
      const updatedCar: Car = { ...exitingCar, state: 'exiting' };

      if (!chaosMode) {
        // wait(full)
        addEvent('wait', 'full', exitingCar.id);
        // wait(mutex)
        addEvent('wait', 'mutex', exitingCar.id);
        // signal(mutex)
        addEvent('signal', 'mutex', exitingCar.id);
        // signal(empty)
        addEvent('signal', 'empty', exitingCar.id);
      }

      // Remove exiting car after animation
      setTimeout(() => {
        setState(p => ({
          ...p,
          exitingCars: p.exitingCars.filter(c => c.id !== exitingCar.id),
        }));
      }, 800);

      return {
        ...prev,
        parkedCars: parkedCars.slice(1),
        exitingCars: [...prev.exitingCars, updatedCar],
        semaphores: chaosMode ? semaphores : {
          mutex: 1,
          empty: semaphores.empty + 1,
          full: semaphores.full - 1,
        },
      };
    });
  }, [addEvent]);

  const toggleRunning = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState(prev => ({
      cars: [],
      parkedCars: [],
      waitingCars: [],
      exitingCars: [],
      semaphores: {
        mutex: 1,
        empty: prev.capacity,
        full: 0,
      },
      events: [],
      capacity: prev.capacity,
      isRunning: false,
      speed: prev.speed,
      chaosMode: prev.chaosMode,
      stepMode: prev.stepMode,
    }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  const setCapacity = useCallback((capacity: number) => {
    setState(prev => ({
      ...prev,
      capacity,
      semaphores: {
        ...prev.semaphores,
        empty: capacity - prev.parkedCars.length,
      },
    }));
  }, []);

  const toggleChaosMode = useCallback(() => {
    setState(prev => ({ ...prev, chaosMode: !prev.chaosMode }));
  }, []);

  const toggleStepMode = useCallback(() => {
    setState(prev => ({ ...prev, stepMode: !prev.stepMode }));
  }, []);

  const step = useCallback(() => {
    processQueue();
  }, [processQueue]);

  // Auto-process queue when running
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (state.isRunning && !state.stepMode) {
      const interval = 2000 / state.speed;
      intervalRef.current = setInterval(() => {
        processQueue();
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.speed, state.stepMode, processQueue]);

  return {
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
  };
}
