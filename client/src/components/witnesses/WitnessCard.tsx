import { Witness } from '@/types/hive';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useKeychain } from '@/context/KeychainContext';
import { useState } from 'react';
import VoteModal from '../modals/VoteModal';
import LoginModal from '../modals/LoginModal';

interface WitnessCardProps {
  witness: Witness;
  highlighted?: boolean;
}

export default function WitnessCard({ witness, highlighted = false }: WitnessCardProps) {
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
    <>
      <div className={`p-4 border rounded-lg shadow-sm ${
        highlighted 
          ? 'bg-primary/5 border-primary/20' 
          : 'bg-card border-border'
      }`}>
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 mr-3">
              <AvatarImage src={witness.profileImage} alt={witness.name} />
              <AvatarFallback>{witness.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-base font-medium text-foreground">@{witness.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Rank: #{witness.rank}</p>
            </div>
          </div>
          <Button 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleVoteClick}
          >
            <span className="material-symbols-outlined text-sm">how_to_vote</span>
            Vote
          </Button>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Votes</dt>
            <dd className="font-medium text-foreground text-xs sm:text-sm truncate">{witness.votesHivePower}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Last Block</dt>
            <dd className="font-medium text-foreground text-xs sm:text-sm truncate">{witness.lastBlock}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Price Feed</dt>
            <dd className="font-medium text-foreground text-xs sm:text-sm truncate">{witness.priceFeed}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Version</dt>
            <dd className="font-medium text-foreground text-xs sm:text-sm truncate">{witness.version}</dd>
          </div>
        </div>
      </div>
      
      <VoteModal 
        open={voteModalOpen} 
        onClose={() => setVoteModalOpen(false)} 
        witness={witness.name} 
      />
      
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </>
  );
}
