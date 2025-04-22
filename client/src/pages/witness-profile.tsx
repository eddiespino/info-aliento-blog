import { useParams } from 'wouter';
import { useWitness, useWitnessVoters, usePagination } from '@/hooks/useWitnesses';
import { useKeychain } from '@/context/KeychainContext';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import VoteModal from '@/components/modals/VoteModal';
import LoginModal from '@/components/modals/LoginModal';
import ProxyAccountsModal from '@/components/modals/ProxyAccountsModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export default function WitnessProfile() {
  const params = useParams<{ name: string }>();
  const witnessName = params.name?.replace('@', '');
  const { witness, isLoading } = useWitness(witnessName);
  const { voters, isLoading: isLoadingVoters } = useWitnessVoters(witnessName);
  const { isLoggedIn } = useKeychain();
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Pagination for voters list
  const { paginatedItems: paginatedVoters, currentPage, totalPages, nextPage, prevPage, goToPage } = usePagination(voters, 10);
  
  const handleVoteClick = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    
    setVoteModalOpen(true);
  };
  
  // Handle the case where the witness doesn't exist
  if (!isLoading && !witness) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-6">Witness Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8">
              The witness <span className="font-medium">@{witnessName}</span> was not found on the Hive blockchain.
            </p>
            <Button asChild>
              <Link href="/witnesses">View All Witnesses</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column with witness profile */}
          <div className="lg:col-span-1">
            <Card className="mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex justify-between items-center">
                  <span>Witness Profile</span>
                  {!isLoading && witness && (
                    <Badge variant="secondary" className="ml-2 text-secondary-foreground">
                      Rank #{witness.rank}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <div className="w-full mt-4">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ) : witness ? (
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={witness.profileImage} alt={witness.name} />
                      <AvatarFallback>{witness.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <h2 className="text-xl font-bold mt-4">@{witness.name}</h2>
                    <p className="text-muted-foreground">Active since {new Date(witness.created).toLocaleDateString()}</p>
                    
                    <Button 
                      className="w-full mt-6"
                      onClick={handleVoteClick}
                    >
                      <span className="material-symbols-outlined mr-2">how_to_vote</span>
                      Vote for Witness
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">Failed to load witness data.</p>
                )}
              </CardContent>
            </Card>
            
            {!isLoading && witness && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Witness Stats</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <dl className="grid grid-cols-1 gap-y-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">Total Votes</dt>
                      <dd className="mt-1 text-lg font-medium">{witness.votesHivePower}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm text-muted-foreground">Last Block</dt>
                      <dd className="mt-1 text-lg font-medium">{witness.lastBlock}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm text-muted-foreground">Missed Blocks</dt>
                      <dd className="mt-1 text-lg font-medium">{witness.missedBlocks.toLocaleString()}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm text-muted-foreground">Price Feed</dt>
                      <dd className="mt-1 text-lg font-medium">{witness.priceFeed}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm text-muted-foreground">Version</dt>
                      <dd className="mt-1 text-lg font-medium">{witness.version}</dd>
                    </div>
                    
                    {witness.url && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Website</dt>
                        <dd className="mt-1 text-lg font-medium">
                          <a
                            href={witness.url.startsWith('http') ? witness.url : `http://${witness.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Visit Website
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right column with tabs for additional info */}
          <div className="lg:col-span-2">
            <Card>
              <Tabs defaultValue="profile" onValueChange={setActiveTab} value={activeTab}>
                <CardHeader className="pb-0">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="profile">About</TabsTrigger>
                    <TabsTrigger value="voters">Voters</TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <TabsContent value="profile" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">About {witnessName}</h3>
                        
                        {isLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        ) : witness ? (
                          <div>
                            <p className="text-muted-foreground mb-4">
                              {witnessName} is a Hive witness currently ranked #{witness.rank} with {witness.votesHivePower} of support from the community.
                            </p>
                            
                            <p className="text-muted-foreground mb-4">
                              As a Hive witness, {witnessName} is responsible for validating transactions, securing the blockchain, and participating in blockchain governance decisions.
                            </p>
                            
                            <p className="text-muted-foreground">
                              Witnesses are elected by Hive stakeholders and provide critical infrastructure for the Hive blockchain's operation.
                            </p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Failed to load witness data.</p>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Block Production</h3>
                        
                        {isLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        ) : witness ? (
                          <p className="text-muted-foreground">
                            This witness has produced blocks up to number {witness.lastBlock} and has missed a total of {witness.missedBlocks.toLocaleString()} blocks throughout their history.
                            A lower number of missed blocks indicates better reliability and uptime.
                          </p>
                        ) : (
                          <p className="text-muted-foreground">Failed to load witness data.</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="voters" className="mt-0">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Voters</h3>
                      
                      {isLoadingVoters ? (
                        <div className="space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : voters.length > 0 ? (
                        <>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">Account</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead className="text-right">Own HP</TableHead>
                                <TableHead className="text-right">Proxied HP</TableHead>
                                <TableHead className="text-right">Total governance vote</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedVoters.map((voter) => (
                                <TableRow key={voter.username}>
                                  <TableCell>
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={voter.profileImage} alt={voter.username} />
                                      <AvatarFallback>{voter.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                  </TableCell>
                                  <TableCell>@{voter.username}</TableCell>
                                  <TableCell className="text-right font-medium">{voter.hivePower}</TableCell>
                                  <TableCell className="text-right font-medium">
                                    {voter.proxiedHivePower ? voter.proxiedHivePower : "-"}
                                  </TableCell>
                                  <TableCell className="text-right font-medium text-primary">
                                    {voter.totalHivePower || (() => {
                                      // Calculate total governance vote (own + proxied) if not already provided
                                      const ownHP = parseFloat(voter.hivePower.replace(/[^0-9.]/g, ''));
                                      const proxiedHP = voter.proxiedHivePower ? 
                                        parseFloat(voter.proxiedHivePower.replace(/[^0-9.]/g, '')) : 0;
                                      
                                      const totalHP = ownHP + proxiedHP;
                                      return totalHP.toLocaleString() + ' governance vote';
                                    })()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          
                          {totalPages > 1 && (
                            <Pagination className="mt-6">
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious onClick={prevPage} />
                                </PaginationItem>
                                
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                  const pageNumber = i + 1;
                                  return (
                                    <PaginationItem key={i}>
                                      <PaginationLink 
                                        isActive={pageNumber === currentPage}
                                        onClick={() => goToPage(pageNumber)}
                                      >
                                        {pageNumber}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                })}
                                
                                {totalPages > 5 && (
                                  <>
                                    <PaginationItem>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                    <PaginationItem>
                                      <PaginationLink 
                                        onClick={() => goToPage(totalPages)}
                                      >
                                        {totalPages}
                                      </PaginationLink>
                                    </PaginationItem>
                                  </>
                                )}
                                
                                <PaginationItem>
                                  <PaginationNext onClick={nextPage} />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          )}
                        </>
                      ) : (
                        <p className="text-muted-foreground">No voters found for this witness.</p>
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {witnessName && (
        <VoteModal 
          open={voteModalOpen} 
          onClose={() => setVoteModalOpen(false)} 
          witness={witnessName} 
        />
      )}
      
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </section>
  );
}