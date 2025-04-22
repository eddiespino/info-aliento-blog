import { useQuery } from '@tanstack/react-query';
import { getWitnesses, getWitnessByName, getWitnessVoters, getProxyAccounts } from '@/api/hive';
import { Witness, WitnessVoter, ProxyAccount } from '@/types/hive';
import { useState, useMemo } from 'react';

export function useWitnesses(searchTerm: string = '', sortBy: 'rank' | 'votes' | 'name' | 'lastBlock' = 'rank') {
  const { data: witnesses = [], isLoading, isError, error } = useQuery({
    queryKey: ['witnesses'],
    queryFn: getWitnesses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

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
    error
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