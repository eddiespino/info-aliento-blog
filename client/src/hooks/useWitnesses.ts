import { useQuery } from '@tanstack/react-query';
import { getWitnesses, getWitnessByName, getWitnessVoters, getProxyAccounts, getBestHiveNode } from '@/api/hive';
import { Witness, WitnessVoter, ProxyAccount } from '@/types/hive';
import { useState, useMemo, useEffect, useCallback } from 'react';

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

// Updated witnesses hook with pagination and inactive filter
export function useWitnesses(
  searchTerm: string = '', 
  sortBy: 'rank' | 'votes' | 'name' | 'lastBlock' = 'rank',
  hideInactive: boolean = false
) {
  // Track current page/offset for pagination
  const [currentPage, setCurrentPage] = useState(0);
  // Track if we have more witnesses to load
  const [hasMoreWitnesses, setHasMoreWitnesses] = useState(true);
  // Track the total number of witnesses loaded so far
  const [loadedCount, setLoadedCount] = useState(0);
  // Track all witnesses loaded so far (accumulate)
  const [allWitnesses, setAllWitnesses] = useState<Witness[]>([]);
  
  // This function will be used by useQuery to fetch witness data
  const fetchWitnesses = async () => {
    // Fetch witnesses with the current offset
    const result = await getWitnesses(currentPage * 100, 100);
    
    // If we received fewer than 100 witnesses, we've reached the end
    if (result.length < 100) {
      setHasMoreWitnesses(false);
    } else {
      setHasMoreWitnesses(true);
    }
    
    // Always just set the current page of witnesses (don't accumulate)
    setAllWitnesses(result);
    
    // Update the loaded count for the current page
    setLoadedCount((currentPage + 1) * 100);
    
    return result;
  };
  
  const { 
    data: currentWitnesses = [], 
    isLoading, 
    isError, 
    error, 
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['witnesses', currentPage],
    queryFn: fetchWitnesses,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // TanStack Query v5 way to keep previous data while loading
  });
  
  // Track current block producer
  const currentBlockProducer = useCurrentBlockProducer();
  
  // Set up automatic refreshing of witness data every 3 seconds - only for the first page
  useEffect(() => {
    if (currentPage === 0) {
      const intervalId = setInterval(() => {
        refetch();
      }, 3000); // 3 second refresh for last block numbers
      
      return () => clearInterval(intervalId);
    }
  }, [refetch, currentPage]);

  // Filter all witnesses by search term and activity status
  const filteredWitnesses = useMemo(() => {
    let filtered = [...allWitnesses]; // Make a copy to avoid mutating the original data
    
    // Apply search filter if search term exists
    if (searchTerm) {
      filtered = filtered.filter((witness) => 
        witness.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply inactive filter if enabled
    if (hideInactive) {
      filtered = filtered.filter((witness) => witness.isActive === true);
    }
    
    return filtered;
  }, [allWitnesses, searchTerm, hideInactive]);

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

  // Set the current page
  const goToPage = useCallback((pageNumber: number) => {
    if (!isFetching) {
      setCurrentPage(pageNumber);
    }
  }, [isFetching]);

  // Set a fixed total pages number (we know there are approximately 600 witnesses total)
  const totalPages = 6; // 6 pages of 100 witnesses each

  return {
    witnesses: sortedWitnesses,
    isLoading,
    isError,
    error,
    currentBlockProducer,
    currentPage,
    totalPages,
    goToPage,
    isFetching,
    totalWitnessesLoaded: loadedCount
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