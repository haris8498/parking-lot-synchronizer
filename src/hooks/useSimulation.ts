import { useState, useCallback, useRef, useEffect } from 'react';
import { Car, Semaphores, SimulationEvent, SimulationState, CarState } from '@/types/simulation';
import { toast } from 'sonner';

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

const CAR_NAMES = [
  'Tesla', 'BMW', 'Audi', 'Mercedes', 'Porsche', 'Ferrari', 
  'Lambo', 'Ford', 'Honda', 'Toyota', 'Mazda', 'Subaru'
];

const generateCarId = () => `car-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const getRandomColor = () => CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
const getRandomName = () => CAR_NAMES[Math.floor(Math.random() * CAR_NAMES.length)];

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

  const [autoSpawn, setAutoSpawn] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const processingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoSpawnRef = useRef<NodeJS.Timeout | null>(null);

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
          toast.success(`${nextCar.name} parked (CHAOS!)`, { duration: 1500 });
          
          return {
            ...prev,
            waitingCars: waitingCars.slice(1),
            parkedCars: [...parkedCars, updatedCar],
          };
        } else {
          // Race condition - car tries to park but slot is taken!
          toast.error(`Race condition! ${nextCar.name} crashed!`, { duration: 2000 });
        }
        return prev;
      }

      // Proper semaphore logic
      if (semaphores.empty <= 0) {
        // No slots available, car stays blocked
        if (nextCar.state !== 'blocked') {
          addEvent('wait', 'empty', nextCar.id, true);
          toast.warning(`${nextCar.name} blocked - parking full!`, { duration: 1500 });
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
      toast.success(`${nextCar.name} parked in P${slotIndex + 1}`, { duration: 1500 });

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
    const name = getRandomName();
    const newCar: Car = {
      id: generateCarId(),
      state: 'waiting',
      color: getRandomColor(),
      name,
    };

    toast.info(`${name} joined the queue`, { duration: 1000 });

    setState(prev => ({
      ...prev,
      waitingCars: [...prev.waitingCars, newCar],
    }));
  }, []);

  const removeCarFromSlot = useCallback((slotIndex: number) => {
    setState(prev => {
      const { parkedCars, semaphores, chaosMode } = prev;
      
      const carToRemove = parkedCars.find(c => c.slotIndex === slotIndex);
      if (!carToRemove) return prev;

      const updatedCar: Car = { ...carToRemove, state: 'exiting' };
      toast.info(`${carToRemove.name} leaving P${slotIndex + 1}`, { duration: 1500 });

      if (!chaosMode) {
        addEvent('wait', 'full', carToRemove.id);
        addEvent('wait', 'mutex', carToRemove.id);
        addEvent('signal', 'mutex', carToRemove.id);
        addEvent('signal', 'empty', carToRemove.id);
      }

      setTimeout(() => {
        setState(p => ({
          ...p,
          exitingCars: p.exitingCars.filter(c => c.id !== carToRemove.id),
        }));
      }, 800);

      return {
        ...prev,
        parkedCars: parkedCars.filter(c => c.id !== carToRemove.id),
        exitingCars: [...prev.exitingCars, updatedCar],
        semaphores: chaosMode ? semaphores : {
          mutex: 1,
          empty: semaphores.empty + 1,
          full: semaphores.full - 1,
        },
      };
    });
  }, [addEvent]);

  const removeCar = useCallback(() => {
    setState(prev => {
      const { parkedCars } = prev;
      if (parkedCars.length === 0) return prev;
      const firstCar = parkedCars[0];
      return prev;
    });

    // Use the slot-based removal
    const firstParked = state.parkedCars[0];
    if (firstParked?.slotIndex !== undefined) {
      removeCarFromSlot(firstParked.slotIndex);
    }
  }, [state.parkedCars, removeCarFromSlot]);

  const removeFromQueue = useCallback((carId: string) => {
    setState(prev => {
      const car = prev.waitingCars.find(c => c.id === carId);
      if (car) {
        toast.info(`${car.name} left the queue`, { duration: 1000 });
      }
      return {
        ...prev,
        waitingCars: prev.waitingCars.filter(c => c.id !== carId),
      };
    });
  }, []);

  const toggleRunning = useCallback(() => {
    setState(prev => {
      const newIsRunning = !prev.isRunning;
      if (newIsRunning) {
        toast.success('Simulation started', { duration: 1000 });
      } else {
        toast.info('Simulation paused', { duration: 1000 });
      }
      return { ...prev, isRunning: newIsRunning };
    });
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoSpawnRef.current) clearInterval(autoSpawnRef.current);
    setAutoSpawn(false);
    setSelectedCar(null);
    toast.info('Simulation reset', { duration: 1000 });
    
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
    setState(prev => {
      const newChaosMode = !prev.chaosMode;
      if (newChaosMode) {
        toast.error('CHAOS MODE ENABLED!', { duration: 2000 });
      } else {
        toast.success('Semaphores restored', { duration: 1500 });
      }
      return { ...prev, chaosMode: newChaosMode };
    });
  }, []);

  const toggleStepMode = useCallback(() => {
    setState(prev => ({ ...prev, stepMode: !prev.stepMode, isRunning: false }));
  }, []);

  const toggleAutoSpawn = useCallback(() => {
    setAutoSpawn(prev => {
      if (!prev) {
        toast.success('Auto-spawn enabled', { duration: 1000 });
      } else {
        toast.info('Auto-spawn disabled', { duration: 1000 });
      }
      return !prev;
    });
  }, []);

  const step = useCallback(() => {
    processQueue();
  }, [processQueue]);

  const selectCar = useCallback((car: Car | null) => {
    setSelectedCar(car);
  }, []);

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

  // Auto-spawn cars
  useEffect(() => {
    if (autoSpawnRef.current) {
      clearInterval(autoSpawnRef.current);
    }

    if (autoSpawn) {
      const interval = 3000 / state.speed;
      autoSpawnRef.current = setInterval(() => {
        if (state.waitingCars.length < 8) {
          addCar();
        }
      }, interval);
    }

    return () => {
      if (autoSpawnRef.current) {
        clearInterval(autoSpawnRef.current);
      }
    };
  }, [autoSpawn, state.speed, state.waitingCars.length, addCar]);

  return {
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
  };
}
