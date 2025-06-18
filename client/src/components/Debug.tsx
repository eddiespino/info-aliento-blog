import { useNetworkStats } from '@/hooks/useNetworkStats';
import { useAlientoWitness } from '@/hooks/useWitnesses';
import { useState, useEffect } from 'react';
import { getNetworkStats, getWitnessByName } from '@/api/hive';

export default function Debug() {
  const [directNetStats, setDirectNetStats] = useState<any>(null);
  const [directNetError, setDirectNetError] = useState<string | null>(null);
  const [directWitness, setDirectWitness] = useState<any>(null);
  const [directWitnessError, setDirectWitnessError] = useState<string | null>(null);
  
  const { stats, isLoading: statsLoading, error: statsError, isError: isStatsError } = useNetworkStats();
  const { witness, isLoading: witnessLoading, error: witnessError, isError: isWitnessError } = useAlientoWitness();

  useEffect(() => {
    let isMounted = true;
    
    const fetchDirect = async () => {
      try {
        const netStats = await getNetworkStats();
        if (isMounted) {
          setDirectNetStats(netStats);
          setDirectNetError(null);
        }
      } catch (error) {
        if (isMounted) {
          setDirectNetError(String(error));
        }
      }
      
      try {
        const witness = await getWitnessByName('aliento');
        if (isMounted) {
          setDirectWitness(witness);
          setDirectWitnessError(null);
        }
      } catch (error) {
        if (isMounted) {
          setDirectWitnessError(String(error));
        }
      }
    };
    
    fetchDirect();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Debug Information</h2>
      
      <div className="mb-4">
        <h3 className="font-medium">Network Stats (Hook):</h3>
        <div className="ml-4">
          <p>Loading: {String(statsLoading)}</p>
          <p>Error: {isStatsError ? String(statsError) : 'None'}</p>
          <p>Data: {stats ? 'Available' : 'None'}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium">Witness Data (Hook):</h3>
        <div className="ml-4">
          <p>Loading: {String(witnessLoading)}</p>
          <p>Error: {isWitnessError ? String(witnessError) : 'None'}</p>
          <p>Data: {witness ? 'Available' : 'None'}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium">Direct Network Stats:</h3>
        <div className="ml-4">
          <p>Error: {directNetError || 'None'}</p>
          <p>Data: {directNetStats ? 'Available' : 'None'}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium">Direct Witness:</h3>
        <div className="ml-4">
          <p>Error: {directWitnessError || 'None'}</p>
          <p>Data: {directWitness ? 'Available' : 'None'}</p>
        </div>
      </div>
    </div>
  );
}