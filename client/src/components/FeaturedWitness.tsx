import { useAlientoWitness } from '@/hooks/useWitnesses';
import { useKeychain } from '@/context/KeychainContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import VoteModal from './modals/VoteModal';
import LoginModal from './modals/LoginModal';
import { Badge } from '@/components/ui/badge';
import alientoLogo from '@/assets/aliento-logo.png';

export default function FeaturedWitness() {
  const { witness, isLoading } = useAlientoWitness();
  const { isLoggedIn } = useKeychain();
  const { t } = useLanguage();
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
          {t('home.featured')}
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-6">Aliento Witness</h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
          {t('about.purposeDesc')}
        </p>
        
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col">
            <dt className="text-xs sm:text-sm font-medium text-muted-foreground">{t('profile.rank')}</dt>
            {isLoading ? (
              <Skeleton className="h-7 sm:h-8 w-16 mt-1" />
            ) : (
              <dd className="mt-1 text-xl sm:text-2xl font-semibold text-primary">#{witness?.rank}</dd>
            )}
          </div>
          <div className="flex flex-col">
            <dt className="text-xs sm:text-sm font-medium text-muted-foreground">{t('profile.votes')}</dt>
            {isLoading ? (
              <Skeleton className="h-7 sm:h-8 w-24 mt-1" />
            ) : (
              <dd className="mt-1 text-xl sm:text-2xl font-semibold text-primary">{witness?.votesHivePower}</dd>
            )}
          </div>
          <div className="flex flex-col">
            <dt className="text-xs sm:text-sm font-medium text-muted-foreground">{t('profile.lastBlock')}</dt>
            {isLoading ? (
              <Skeleton className="h-7 sm:h-8 w-28 mt-1" />
            ) : (
              <dd className="mt-1 text-xl sm:text-2xl font-semibold text-primary">{witness?.lastBlock}</dd>
            )}
          </div>
          <div className="flex flex-col">
            <dt className="text-xs sm:text-sm font-medium text-muted-foreground">{t('profile.uptime')}</dt>
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
            {isLoggedIn ? t('profile.voteFor') + ' @aliento' : t('login.withKeychain') + ' ' + t('login.toVoteForWitnesses')}
          </Button>
        </div>
      </div>
      
      {/* Image and quote card - responsive design */}
      <div className="relative mt-8 lg:mt-0">
        {/* Main image - Aliento Logo */}
        <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-lg p-12 flex justify-center items-center">
          <img 
            src={alientoLogo} 
            alt="Aliento Logo" 
            className="w-3/4 max-w-[300px]"
          />
        </div>
        
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
              <p className="text-xs sm:text-sm text-muted-foreground">{t('profile.since')} 2022</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            "{t('about.mission')}"
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
