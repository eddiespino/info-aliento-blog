import { useAlientoWitness } from '@/hooks/useWitnesses';
import { useKeychain } from '@/context/KeychainContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import VoteModal from './modals/VoteModal';
import LoginModal from './modals/LoginModal';
import { Badge } from '@/components/ui/badge';

export default function FeaturedWitness() {
  const { witness, isLoading } = useAlientoWitness();
  const { isLoggedIn } = useKeychain();
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleVoteClick = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    
    setVoteModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <Badge variant="secondary" className="mb-4">
          Featured Witness
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">Aliento Witness</h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
          The Aliento project is dedicated to supporting the Hive blockchain ecosystem through reliable witness operations, 
          community development, and innovative tools that enhance the blockchain experience for all users.
        </p>
        
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col">
            <dt className="text-xs sm:text-sm font-medium text-muted-foreground">Witness Rank</dt>
            {isLoading ? (
              <Skeleton className="h-7 sm:h-8 w-16 mt-1" />
            ) : (
              <dd className="mt-1 text-xl sm:text-2xl font-semibold text-primary">#{witness?.rank}</dd>
            )}
          </div>
          <div className="flex flex-col">
            <dt className="text-xs sm:text-sm font-medium text-muted-foreground">Total Votes</dt>
            {isLoading ? (
              <Skeleton className="h-7 sm:h-8 w-24 mt-1" />
            ) : (
              <dd className="mt-1 text-xl sm:text-2xl font-semibold text-primary">{witness?.votesHivePower}</dd>
            )}
          </div>
          <div className="flex flex-col">
            <dt className="text-xs sm:text-sm font-medium text-muted-foreground">Last Block</dt>
            {isLoading ? (
              <Skeleton className="h-7 sm:h-8 w-28 mt-1" />
            ) : (
              <dd className="mt-1 text-xl sm:text-2xl font-semibold text-primary">{witness?.lastBlock}</dd>
            )}
          </div>
          <div className="flex flex-col">
            <dt className="text-xs sm:text-sm font-medium text-muted-foreground">Uptime</dt>
            {isLoading ? (
              <Skeleton className="h-7 sm:h-8 w-16 mt-1" />
            ) : (
              <dd className="mt-1 text-xl sm:text-2xl font-semibold text-primary">99.98%</dd>
            )}
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 flex flex-shrink-0">
          <Button
            className="w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={handleVoteClick}
          >
            <span className="material-symbols-outlined">how_to_vote</span>
            {isLoggedIn ? 'Vote for Aliento' : 'Login to Vote'}
          </Button>
        </div>
      </div>
      
      {/* Image and quote card - responsive design */}
      <div className="relative mt-8 lg:mt-0">
        {/* Main image */}
        <img 
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Network nodes visualization" 
          className="rounded-xl shadow-lg w-full"
        />
        
        {/* Quote card with different positioning for mobile/desktop */}
        <div className="bg-card text-card-foreground rounded-lg shadow-lg border border-border p-4 sm:p-6 
                       max-w-full sm:max-w-xs 
                       lg:absolute lg:-bottom-6 lg:-left-6
                       mt-4 lg:mt-0">
          <div className="flex items-center mb-3 sm:mb-4">
            {isLoading ? (
              <Skeleton className="h-10 sm:h-12 w-10 sm:w-12 rounded-full mr-3 sm:mr-4" />
            ) : (
              <img 
                src={witness?.profileImage} 
                alt="Aliento Witness Profile" 
                className="h-10 sm:h-12 w-10 sm:w-12 rounded-full mr-3 sm:mr-4"
              />
            )}
            <div>
              <h4 className="font-medium text-foreground">@aliento</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Witness since 2021</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            "Our mission is to support and strengthen the Hive ecosystem through reliable infrastructure and community-focused initiatives."
          </p>
        </div>
      </div>
      
      {/* Modals */}
      {witness && (
        <VoteModal 
          open={voteModalOpen} 
          onClose={() => setVoteModalOpen(false)} 
          witness="aliento" 
        />
      )}
      
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </div>
  );
}
