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
      <div className={`p-4 border rounded-lg shadow-sm ${highlighted ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-3">
              <AvatarImage src={witness.profileImage} alt={witness.name} />
              <AvatarFallback>{witness.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-base font-medium text-gray-900">@{witness.name}</h3>
              <p className="text-sm text-gray-500">Rank: #{witness.rank}</p>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-primary-500 hover:bg-primary-600"
            onClick={handleVoteClick}
          >
            Vote
          </Button>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Votes</dt>
            <dd className="font-medium text-gray-900">{witness.votesHivePower}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Last Block</dt>
            <dd className="font-medium text-gray-900">{witness.lastBlock}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Price Feed</dt>
            <dd className="font-medium text-gray-900">{witness.priceFeed}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Version</dt>
            <dd className="font-medium text-gray-900">{witness.version}</dd>
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
