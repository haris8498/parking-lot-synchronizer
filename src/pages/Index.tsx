import { Helmet } from 'react-helmet';
import { ParkingSimulation } from '@/components/ParkingSimulation';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Producer-Consumer Simulation | Semaphore Visualization</title>
        <meta 
          name="description" 
          content="Interactive car parking simulation demonstrating the Producer-Consumer problem using semaphores. Learn about mutex, synchronization, and race conditions visually." 
        />
      </Helmet>
      <ParkingSimulation />
    </>
  );
};

export default Index;
