import { useState, useEffect, useRef, useCallback } from 'react';
import { useWitnesses, useLazyLoading } from '@/hooks/useWitnesses';
import WitnessCard from './WitnessCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useIsMobile as useMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import VoteModal from '../modals/VoteModal';
import { useKeychain } from '@/context/KeychainContext';
import { useLanguage } from '@/context/LanguageContext';
import LoginModal from '../modals/LoginModal';
import { Progress } from '@/components/ui/progress';
import { Link } from 'wouter';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SortOption = 'rank' | 'votes' | 'name' | 'lastBlock';

export default function WitnessList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rank');
  const { witnesses, isLoading } = useWitnesses(searchTerm, sortBy);
  const { visibleItems, loadMore, hasMore, percent } = useLazyLoading(witnesses, 20, 20);
  const isMobile = useMobile();
  const [selectedWitness, setSelectedWitness] = useState<string | null>(null);
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { isLoggedIn } = useKeychain();
  const { t } = useLanguage();
  
  // References to observe for intersection - separate refs for different element types
  const liRef = useRef<HTMLLIElement>(null);
  const trRef = useRef<HTMLTableRowElement>(null);

  // Implement intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    // Observe both possible ref targets
    const liTarget = liRef.current;
    const trTarget = trRef.current;
    
    if (liTarget) observer.observe(liTarget);
    if (trTarget) observer.observe(trTarget);

    return () => {
      if (liTarget) observer.unobserve(liTarget);
      if (trTarget) observer.unobserve(trTarget);
    };
  }, [loadMore, hasMore, liRef, trRef]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  const handleVoteClick = (witnessName: string) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    
    setSelectedWitness(witnessName);
    setVoteModalOpen(true);
  };

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder={t('witnesses.search')}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-4 pr-10"
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            search
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{t('sort.by')}:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('sort.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">{t('witnesses.rank')}</SelectItem>
              <SelectItem value="votes">{t('witnesses.votes')}</SelectItem>
              <SelectItem value="name">{t('witnesses.name')}</SelectItem>
              <SelectItem value="lastBlock">{t('witnesses.lastBlock')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Card View */}
      {isMobile && (
        <div className="md:hidden">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Skeleton className="h-12 w-12 rounded-full mr-4" />
                      <div>
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-16 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-border bg-card shadow rounded-lg border border-border">
              {visibleItems.map((witness: any) => (
                <li 
                  key={witness.id} 
                  className={`px-4 py-4 ${witness.name === 'aliento' ? 'bg-primary/10' : ''} ${!witness.isActive ? 'bg-muted opacity-75' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <Link href={`/witness/${witness.name}`} className="flex items-center hover:opacity-90 transition-opacity">
                      <div className="mr-4 flex-shrink-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={witness.profileImage} alt={witness.name} />
                          <AvatarFallback>{witness.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-medium text-foreground">@{witness.name}</h3>
                          {!witness.isActive && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="bg-destructive/10 text-destructive text-xs">
                                    Inactive
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">No blocks signed in last 72 hours</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{t('witnesses.rank')}: #{witness.rank}</p>
                      </div>
                    </Link>
                    <Button 
                      size="sm"
                      className="ml-2"
                      onClick={() => handleVoteClick(witness.name)}
                    >
                      {t('witnesses.vote')}
                    </Button>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-muted-foreground">{t('witnesses.votes')}</dt>
                      <dd className="font-medium text-foreground">{witness.votesHivePower}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t('witnesses.lastBlock')}</dt>
                      <dd className="font-medium text-foreground">{witness.lastBlock}</dd>
                    </div>
                  </div>
                </li>
              ))}
              {hasMore && (
                <li ref={liRef} className="p-4 flex justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </li>
              )}
            </ul>
          )}
        </div>
      )}

      {/* Desktop Table View */}
      {!isMobile && (
        <div className="hidden md:block">
          <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('witnesses.rank')}</TableHead>
                  <TableHead>{t('witnesses.name')}</TableHead>
                  <TableHead>{t('witnesses.votes')}</TableHead>
                  <TableHead>{t('witnesses.lastBlock')}</TableHead>
                  <TableHead>{t('witnesses.fee')}</TableHead>
                  <TableHead>{t('witnesses.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Skeleton className="h-10 w-10 rounded-full mr-4" />
                          <div className="flex flex-col">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16 mt-1" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>
                    {visibleItems.map((witness: any) => (
                      <TableRow 
                        key={witness.id} 
                        className={`
                          ${witness.name === 'aliento' ? 'bg-primary/10' : 'hover:bg-muted/50'}
                          ${!witness.isActive ? 'bg-muted/60 opacity-80' : ''}
                        `}
                      >
                        <TableCell className="text-sm text-muted-foreground">
                          #{witness.rank}
                        </TableCell>
                        <TableCell>
                          <Link href={`/witness/${witness.name}`} className="flex items-center hover:opacity-90 transition-opacity">
                            <Avatar className="h-10 w-10 mr-4">
                              <AvatarImage src={witness.profileImage} alt={witness.name} />
                              <AvatarFallback>{witness.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-foreground">@{witness.name}</div>
                                {!witness.isActive && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="bg-destructive/10 text-destructive text-xs">
                                          Inactive
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">No blocks signed in last 72 hours</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">{t('witnesses.version')}: {witness.version}</div>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {witness.votesHivePower}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {witness.lastBlock}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {witness.priceFeed}
                        </TableCell>
                        <TableCell className="text-sm">
                          <Button 
                            variant="link"
                            className="text-primary hover:text-primary/80 p-0"
                            onClick={() => handleVoteClick(witness.name)}
                          >
                            {t('witnesses.vote')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {hasMore && (
                      <TableRow ref={trRef}>
                        <TableCell colSpan={6} className="text-center p-4">
                          <Skeleton className="h-10 w-10 rounded-full mx-auto" />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Loading Progress */}
      {!isLoading && hasMore && (
        <div className="mt-6">
          <div className="border-t border-border bg-card px-4 py-3 sm:px-6 rounded-md shadow-sm">
            {/* Display loading progress */}
            <div className="flex flex-wrap items-center justify-between">
              <p className="text-sm text-muted-foreground mb-3 sm:mb-0">
                {t('witnesses.showing')} <span className="font-medium text-foreground">{visibleItems.length}</span> {t('witnesses.of')}{' '}
                <span className="font-medium text-foreground">{witnesses.length}</span> {t('nav.witnesses').toLowerCase()}
              </p>
              
              <div className="w-full sm:w-1/2 flex items-center gap-3">
                <Progress value={percent} className="h-2" />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{percent}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedWitness && (
        <VoteModal 
          open={voteModalOpen} 
          onClose={() => setVoteModalOpen(false)} 
          witness={selectedWitness} 
        />
      )}
      
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </div>
  );
}
