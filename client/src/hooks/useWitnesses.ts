import { useQuery } from '@tanstack/react-query';
import { getWitnesses, getWitnessByName, getWitnessVoters, getProxyAccounts, getBestHiveNode } from '@/api/hive';
import { Witness, WitnessVoter, ProxyAccount } from '@/types/hive';
import { useState, useMemo, useEffect } from 'react';

// State to track the current block producer
export const useCurrentBlockProducer = () => {
  const [currentBlockProducer, setCurrentBlockProducer] = useState<string | null>(null);
  
  // Poll for the current block producer
  useEffect(() => {
    let mounted = true;
    
    const fetchCurrentBlockProducer = async () => {
      try {
        const apiNode = await getBestHiveNode();
        
        // Get dynamic global properties
        const response = await fetch(apiNode, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "condenser_api.get_dynamic_global_properties",
            "params": [],
            "id": 1
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.result && mounted) {
          // Get the current witness/block producer
          const currentWitness = data.result.current_witness;
          setCurrentBlockProducer(currentWitness);
        }
      } catch (error) {
        console.error('Error fetching current block producer:', error);
      }
    };
    
    // Initial fetch
    fetchCurrentBlockProducer();
    
    // Set up polling interval (every 3 seconds)
    const intervalId = setInterval(fetchCurrentBlockProducer, 3000);
    
    // Clean up on unmount
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);
  
  return currentBlockProducer;
};

export function useWitnesses(searchTerm: string = '', sortBy: 'rank' | 'votes' | 'name' | 'lastBlock' = 'rank') {
  const { data: witnesses = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['witnesses'],
    queryFn: getWitnesses,
    staleTime: 1000 * 60, // 1 minute
  });
  
  // Track current block producer
  const currentBlockProducer = useCurrentBlockProducer();
  
  // Set up automatic refreshing of witness data every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 3000); // 3 second refresh for last block numbers
    
    return () => clearInterval(intervalId);
  }, [refetch]);

  // Filter witnesses by search term
  const filteredWitnesses = useMemo(() => {
    if (!searchTerm) return witnesses;
    
    return witnesses.filter((witness) => 
      witness.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [witnesses, searchTerm]);

  // Sort witnesses
  const sortedWitnesses = useMemo(() => {
    return [...filteredWitnesses].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'votes':
          return parseFloat(b.votes) - parseFloat(a.votes);
        case 'lastBlock':
          return parseInt(b.lastBlock.replace(/,/g, '')) - parseInt(a.lastBlock.replace(/,/g, ''));
        case 'rank':
        default:
          return a.rank - b.rank;
      }
    });
  }, [filteredWitnesses, sortBy]);

  return {
    witnesses: sortedWitnesses,
    isLoading,
    isError,
    error,
    currentBlockProducer
  };
}

export function useWitness(name: string) {
  const { data: witness, isLoading, isError, error } = useQuery({
    queryKey: ['witness', name],
    queryFn: () => getWitnessByName(name),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!name,
  });

  return {
    witness,
    isLoading,
    isError,
    error
  };
}

export function useWitnessVoters(witnessName: string) {
  const { data: voters = [], isLoading, isError, error } = useQuery({
    queryKey: ['witness-voters', witnessName],
    queryFn: () => getWitnessVoters(witnessName),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!witnessName,
  });

  return {
    voters,
    isLoading,
    isError,
    error
  };
}

export function useAlientoWitness() {
  return useWitness('aliento');
}

export function useProxyAccounts(username: string) {
  const { data: proxyAccounts = [], isLoading, isError, error } = useQuery({
    queryKey: ['proxy-accounts', username],
    queryFn: () => getProxyAccounts(username),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!username,
  });

  return {
    proxyAccounts,
    isLoading,
    isError,
    error
  };
}

export function usePagination<T>(items: T[], pageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / pageSize);
  
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);
  
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage
  };
}

// New hook for lazy loading data
export function useLazyLoading<T>(items: T[], initialCount: number = 20, incrementCount: number = 20) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  
  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount);
  }, [items, visibleCount]);
  
  const loadMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + incrementCount, items.length));
  };
  
  const hasMore = visibleCount < items.length;
  
  const percent = items.length > 0 ? Math.round((visibleCount / items.length) * 100) : 0;
  
  return {
    visibleItems,
    loadMore,
    hasMore,
    visibleCount,
    totalCount: items.length,
    percent
  };
}