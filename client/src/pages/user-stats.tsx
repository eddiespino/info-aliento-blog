import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/LanguageContext';
import { useKeychain } from '@/context/KeychainContext';
import { useLocation } from 'wouter';
import { formatHivePower } from '@/lib/utils';
import { getUserData } from '@/api/hive';
import LoginModal from '@/components/modals/LoginModal';

export default function UserStats() {
  const { t } = useLanguage();
  const { user, isLoggedIn, setUser } = useKeychain();
  const [, setLocation] = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Track if we should show login modal and if we have already asked before
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const hasAskedForLoginOnce = useRef(false);

  const handleRefresh = async () => {
    if (!user?.username) return;
    
    setIsRefreshing(true);
    try {
      const freshUserData = await getUserData(user.username);
      setUser(freshUserData);
      localStorage.setItem('hive_current_user', JSON.stringify(freshUserData));
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Force redirect if not logged in with a short delay
  useEffect(() => {
    // Make sure we only run this effect on the client side
    if (typeof window === 'undefined') return;
    
    // Check if user has data in localStorage first
    const hasLocalStorageUser = !!localStorage.getItem('hive_current_user');
    
    // If user is not logged in and we haven't shown login modal yet
    if (!isLoggedIn && !hasAskedForLoginOnce.current && !hasLocalStorageUser) {
      // Mark that we've asked once so we don't keep asking
      hasAskedForLoginOnce.current = true;
      console.log('Opening login modal on first visit (no localStorage user)');
      setLoginModalOpen(true);
    }
  }, [isLoggedIn]);
  
  // Handle close of login modal
  const handleLoginModalClose = () => {
    // If the user canceled the login, redirect them back to home
    if (!isLoggedIn) {
      console.log('User cancelled login, redirecting to home');
      setLocation('/');
    }
    setLoginModalOpen(false);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold">{t('userStats.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('userStats.subtitle')}</p>
        </div>
        {isLoggedIn && (
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="ml-4"
          >
            <span className="material-symbols-outlined text-sm mr-2">
              {isRefreshing ? 'progress_activity' : 'refresh'}
            </span>
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        )}
      </div>

      {!isLoggedIn ? (
        <div className="text-center">
          <p className="mb-4">{t('userStats.needLogin')}</p>
          <Button onClick={() => setLoginModalOpen(true)}>
            {t('login.withKeychain')}
          </Button>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* User Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-card rounded-lg border">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.profileImage} alt={user?.username || 'User'} />
              <AvatarFallback>
                {user?.username?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold">@{user?.username}</h2>
              <div className="flex flex-wrap gap-4 mt-2">
                <Badge variant="outline" className="bg-primary/10">
                  {user?.witnessVotes?.length || 0}/30 witness votes
                </Badge>
              </div>
            </div>
          </div>

          {/* Tabs for different stats */}
          <Card>
            <CardHeader>
              <Tabs defaultValue="power">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="power">{t('userStats.powerAnalysis')}</TabsTrigger>
                  <TabsTrigger value="votes">{t('userStats.witnessVotes')}</TabsTrigger>
                </TabsList>

                <TabsContent value="votes" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{t('userStats.yourWitnessVotes')}</CardTitle>
                      <Badge className="bg-primary text-primary-foreground">
                        {user?.witnessVotes?.length || 0} / 30
                      </Badge>
                    </div>

                    {user?.witnessVotes && user.witnessVotes.length > 0 ? (
                      <div className="space-y-2">
                        {user.witnessVotes.map((witness, index) => (
                          <div 
                            key={witness} 
                            className="flex justify-between items-center p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{index + 1}.</span>
                              <span className="font-medium">@{witness}</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setLocation(`/witness/${witness}`)}
                            >
                              {t('witnesses.viewProfile')}
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">{t('userStats.noWitnessVotes')}</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setLocation('/witnesses')}
                        >
                          {t('userStats.browseWitnesses')}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="power" className="mt-4">
                  <div className="space-y-4">
                    <CardTitle className="text-xl">{t('userStats.hivePowerBreakdown')}</CardTitle>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t('profile.ownHP')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{user?.hivePower}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('userStats.ownHPDesc')}
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t('userStats.effectiveHP')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{user?.effectiveHivePower}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('userStats.effectiveHPDesc')}
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t('profile.proxiedHP')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{user?.proxiedHivePower}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('userStats.proxiedHPDesc')}
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t('userStats.governancePower')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {user?.hivePower && user?.proxiedHivePower ? 
                              formatHivePower(parseFloat(user.hivePower.replace(/,/g, '').replace(' HP', '')) + 
                                                parseFloat(user.proxiedHivePower.replace(/,/g, '').replace(' HP', ''))) : 
                              user?.hivePower}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('userStats.governancePowerDesc')}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      )}

      <LoginModal open={loginModalOpen} onClose={handleLoginModalClose} />
    </section>
  );
}