import { useParams } from 'wouter';
import { useWitness, useWitnessVoters, usePagination } from '@/hooks/useWitnesses';
import { useKeychain } from '@/context/KeychainContext';
import { useLanguage } from '@/context/LanguageContext';
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
import { ExternalLink } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export default function WitnessProfile() {
  const params = useParams<{ name: string }>();
  const witnessName = params.name?.replace('@', '');
  const { witness, isLoading } = useWitness(witnessName);
  const { voters, isLoading: isLoadingVoters } = useWitnessVoters(witnessName);
  const { isLoggedIn, user } = useKeychain();
  const { t } = useLanguage();
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isUnvoteAction, setIsUnvoteAction] = useState(false);
  
  // Helper function to check if the user has already voted for this witness
  const hasVotedForWitness = (): boolean => {
    if (!user || !user.witnessVotes) return false;
    return user.witnessVotes.includes(witnessName);
  };

  // Pagination for voters list
  const { paginatedItems: paginatedVoters, currentPage, totalPages, nextPage, prevPage, goToPage } = usePagination(voters, 10);
  
  const handleVoteClick = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    
    // Check if the user has already voted for this witness
    const hasVoted = hasVotedForWitness();
    
    // Set the action type (vote or unvote)
    setIsUnvoteAction(hasVoted);
    
    // Open vote/unvote confirmation modal
    setVoteModalOpen(true);
  };
  
  // Handle the case where the witness doesn't exist
  if (!isLoading && !witness) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-6">{t('profile.notFound')}</h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('profile.notFoundDesc')} <span className="font-medium">@{witnessName}</span>.
            </p>
            <Button asChild>
              <Link href="/witnesses">{t('profile.viewAll')}</Link>
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
                  <span>{t('profile.title')}</span>
                  {!isLoading && witness && (
                    <Badge variant="secondary" className="ml-2 text-secondary-foreground">
                      {t('profile.rank')} #{witness.rank}
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
                    <p className="text-muted-foreground">{t('profile.activeSince')} {new Date(witness.created).toLocaleDateString()}</p>
                    
                    <Button 
                      className={`w-full mt-6 ${hasVotedForWitness() ? 'bg-muted text-muted-foreground hover:bg-muted/80' : ''}`}
                      onClick={handleVoteClick}
                      variant={hasVotedForWitness() ? "outline" : "default"}
                    >
                      <span className="material-symbols-outlined mr-2">how_to_vote</span>
                      {hasVotedForWitness() ? t('witnesses.unvote') : t('profile.voteFor')}
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">Failed to load witness data.</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right column with tabs for additional info */}
          <div className="lg:col-span-2">
            <Card>
              <Tabs defaultValue="profile" onValueChange={setActiveTab} value={activeTab}>
                <CardHeader className="pb-0">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="profile">{t('profile.about')}</TabsTrigger>
                    <TabsTrigger value="stats">{t('profile.stats')}</TabsTrigger>
                    <TabsTrigger value="voters">{t('profile.voters')}</TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <TabsContent value="profile" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">{t('profile.about')} {witnessName}</h3>
                        
                        {isLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        ) : witness ? (
                          <div>
                            {witness.witnessDescription && (
                              <div className="bg-primary/5 p-4 rounded-lg mb-4">
                                <h4 className="font-medium mb-2">{t('profile.witnessDescription')}</h4>
                                <p className="text-foreground">{witness.witnessDescription}</p>
                              </div>
                            )}
                            
                            <p className="text-muted-foreground mb-4">
                              {witnessName} {t('profile.isWitness')} #{witness.rank} {t('profile.withVotes')} {witness.votesHivePower} {t('profile.fromCommunity')}
                            </p>
                            
                            <p className="text-muted-foreground mb-4">
                              {t('profile.asWitness')} {witnessName} {t('profile.responsible')}
                            </p>
                            
                            <p className="text-muted-foreground mb-4">
                              {t('profile.elected')}
                            </p>
                            
                            {witness.url && (
                              <div className="mt-4">
                                <h4 className="font-medium mb-2">{t('witnesses.website')}</h4>
                                <a
                                  href={witness.url.startsWith('http') ? witness.url : `http://${witness.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-primary hover:underline"
                                >
                                  <ExternalLink size={16} />
                                  {t('profile.visitWebsite')}
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">{t('profile.failed')}</p>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-4">{t('profile.blockProduction')}</h3>
                        
                        {isLoading ? (
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        ) : witness ? (
                          <p className="text-muted-foreground">
                            {t('profile.hasProduced')} {witness.lastBlock} {t('profile.andMissed')} {witness.missedBlocks.toLocaleString()} {t('profile.throughHistory')}
                            {t('profile.reliability.desc')}
                          </p>
                        ) : (
                          <p className="text-muted-foreground">{t('profile.failed')}</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="stats" className="mt-0">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">{t('profile.witnessInfo')}</h3>
                      
                      {isLoading ? (
                        <div className="space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                          ))}
                        </div>
                      ) : witness ? (
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <dt className="text-sm text-muted-foreground">{t('profile.votes')}</dt>
                            <dd className="mt-1 text-lg font-medium">{witness.votesHivePower}</dd>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <dt className="text-sm text-muted-foreground">{t('profile.lastBlock')}</dt>
                            <dd className="mt-1 text-lg font-medium">{witness.lastBlock}</dd>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <dt className="text-sm text-muted-foreground">{t('profile.missedBlocks')}</dt>
                            <dd className="mt-1 text-lg font-medium">{witness.missedBlocks.toLocaleString()}</dd>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <dt className="text-sm text-muted-foreground">{t('witnesses.fee')}</dt>
                            <dd className="mt-1 text-lg font-medium">{witness.priceFeed}</dd>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <dt className="text-sm text-muted-foreground">{t('witnesses.version')}</dt>
                            <dd className="mt-1 text-lg font-medium">{witness.version}</dd>
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <dt className="text-sm text-muted-foreground">{t('witnesses.hbdInterestRate')}</dt>
                            <dd className="mt-1 text-lg font-medium">{witness.hbdInterestRate || '15.00%'}</dd>
                          </div>
                        </dl>
                      ) : (
                        <p className="text-muted-foreground">{t('profile.failed')}</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="voters" className="mt-0">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">{t('profile.votersTitle')}</h3>
                      
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
                                <TableHead className="w-[100px]">{t('profile.account')}</TableHead>
                                <TableHead>{t('profile.username')}</TableHead>
                                <TableHead className="text-right">{t('profile.ownHP')}</TableHead>
                                <TableHead className="text-right">{t('profile.proxiedHP')}</TableHead>
                                <TableHead className="text-right">{t('profile.totalGov')}</TableHead>
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
                        <p className="text-muted-foreground">{t('profile.noVoters')}</p>
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
          unvote={isUnvoteAction}
        />
      )}
      
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </section>
  );
}