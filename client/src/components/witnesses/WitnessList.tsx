import { useState } from 'react';
import { useWitnesses, usePagination } from '@/hooks/useWitnesses';
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
import LoginModal from '../modals/LoginModal';

type SortOption = 'rank' | 'votes' | 'name' | 'lastBlock';

export default function WitnessList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rank');
  const { witnesses, isLoading } = useWitnesses(searchTerm, sortBy);
  const { paginatedItems, currentPage, totalPages, goToPage, nextPage, prevPage } = usePagination(witnesses, 10);
  const isMobile = useMobile();
  const [selectedWitness, setSelectedWitness] = useState<string | null>(null);
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { isLoggedIn } = useKeychain();

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
            placeholder="Search witnesses..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-4 pr-10"
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            search
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Rank</SelectItem>
              <SelectItem value="votes">Total Votes</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="lastBlock">Last Block</SelectItem>
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
              {paginatedItems.map((witness) => (
                <li key={witness.id} className={`px-4 py-4 ${witness.name === 'aliento' ? 'bg-primary/10' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="mr-4 flex-shrink-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={witness.profileImage} alt={witness.name} />
                          <AvatarFallback>{witness.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-foreground">@{witness.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Rank: #{witness.rank}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      className="ml-2"
                      onClick={() => handleVoteClick(witness.name)}
                    >
                      Vote
                    </Button>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Votes</dt>
                      <dd className="font-medium text-foreground">{witness.votesHivePower}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Last Block</dt>
                      <dd className="font-medium text-foreground">{witness.lastBlock}</dd>
                    </div>
                  </div>
                </li>
              ))}
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
                  <TableHead>Rank</TableHead>
                  <TableHead>Witness</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Last Block</TableHead>
                  <TableHead>Price Feed</TableHead>
                  <TableHead>Action</TableHead>
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
                  paginatedItems.map((witness) => (
                    <TableRow 
                      key={witness.id} 
                      className={witness.name === 'aliento' ? 'bg-primary/10' : 'hover:bg-muted/50'}
                    >
                      <TableCell className="text-sm text-muted-foreground">
                        #{witness.rank}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={witness.profileImage} alt={witness.name} />
                            <AvatarFallback>{witness.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-foreground">@{witness.name}</div>
                            <div className="text-sm text-muted-foreground">Version: {witness.version}</div>
                          </div>
                        </div>
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
                          Vote
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-6">
          <nav className="border-t border-border bg-card px-4 py-3 sm:px-6 rounded-md shadow-sm">
            {/* Desktop pagination with stats and page numbers */}
            <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground mb-3 sm:mb-0">
                Showing <span className="font-medium text-foreground">{(currentPage - 1) * 10 + 1}</span> to{' '}
                <span className="font-medium text-foreground">{Math.min(currentPage * 10, witnesses.length)}</span> of{' '}
                <span className="font-medium text-foreground">{witnesses.length}</span> witnesses
              </p>
              
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <span className="material-symbols-outlined text-sm mr-1">chevron_left</span>
                  Previous
                </Button>
                
                <div className="flex mx-2 items-center">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    const pageNum = i + 1;
                    const isCurrentPage = pageNum === currentPage;
                    
                    return (
                      <Button
                        key={i}
                        variant={isCurrentPage ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="mx-1"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="mx-1 text-muted-foreground">...</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToPage(totalPages)}
                        className="mx-1"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                </Button>
              </div>
            </div>
            
            {/* Mobile pagination - simplified */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, witnesses.length)} of {witnesses.length}
                </p>
              </div>
              
              <div className="flex justify-between mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="w-24"
                >
                  <span className="material-symbols-outlined text-sm mr-1">chevron_left</span>
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="w-24"
                >
                  Next
                  <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                </Button>
              </div>
            </div>
          </nav>
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
