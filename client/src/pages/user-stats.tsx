import { useEffect } from 'react';
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
import LoginModal from '@/components/modals/LoginModal';
import { useState } from 'react';

export default function UserStats() {
  const { t } = useLanguage();
  const { user, isLoggedIn } = useKeychain();
  const [, setLocation] = useLocation();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // If user is not logged in, show login modal
  useEffect(() => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    }
  }, [isLoggedIn]);

  // Handle close of login modal
  const handleLoginModalClose = () => {
    if (!isLoggedIn) {
      // If still not logged in, redirect to home
      setLocation('/');
    }
    setLoginModalOpen(false);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">{t('userStats.title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('userStats.subtitle')}</p>
      </div>

      {!isLoggedIn ? (
        <div className="text-center">
          <p className="mb-4">{t('userStats.needLogin')}</p>
          <Button onClick={() => setLoginModalOpen(true)}>
            {t('login.withKeychain')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.profileImage} alt={user?.username || 'User'} />
                  <AvatarFallback>
                    {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-1">@{user?.username}</h2>
                <div className="flex flex-col gap-2 mt-4 w-full">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <span className="text-sm text-muted-foreground">{t('profile.ownHP')}</span>
                    <span className="font-medium">{user?.hivePower}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <span className="text-sm text-muted-foreground">{t('profile.proxiedHP')}</span>
                    <span className="font-medium">{user?.proxiedHivePower}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <span className="text-sm text-muted-foreground">{t('userStats.effectiveHP')}</span>
                    <span className="font-medium">{user?.effectiveHivePower}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <span className="text-sm text-muted-foreground">{t('userStats.witnessVotes')}</span>
                    <Badge variant="outline" className="bg-primary/10 font-medium">
                      {user?.freeWitnessVotes ? 30 - user.freeWitnessVotes : 0}/{30}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different stats */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <Tabs defaultValue="votes">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="votes">{t('userStats.witnessVotes')}</TabsTrigger>
                  <TabsTrigger value="power">{t('userStats.powerAnalysis')}</TabsTrigger>
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
                              formatHivePower(parseFloat(user.hivePower.replace(/,/g, '').replace(' Hive Power', '').replace(' HP', '')) + 
                                                parseFloat(user.proxiedHivePower.replace(/,/g, '').replace(' Hive Power', '').replace(' HP', ''))) : 
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