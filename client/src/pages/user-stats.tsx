import { useEffect, useState } from 'react';
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
import { UserData } from '@/types/hive';
import { useQuery } from '@tanstack/react-query';

export default function UserStats() {
  const { t } = useLanguage();
  const { user: loggedInUser, isLoggedIn, voteWitness } = useKeychain();
  const [location, setLocation] = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Extract username from URL path
  const getUsername = () => {
    if (location === '/user-stats' && loggedInUser?.username) {
      return loggedInUser.username;
    }
    // For URLs like /eddiespino, extract the username
    const match = location.match(/^\/([^/]+)$/);
    return match ? match[1] : null;
  };

  const username = getUsername();
  const isOwnProfile = isLoggedIn && username === loggedInUser?.username;

  // Fetch user data for the specified username
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['userData', username],
    queryFn: () => username ? getUserData(username) : null,
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Redirect to home if no username can be determined
  useEffect(() => {
    if (!username && location !== '/user-stats') {
      setLocation('/');
    }
  }, [username, location, setLocation]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-card rounded-lg border">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="text-center sm:text-left space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The user "@{username}" could not be found on the Hive blockchain.
          </p>
          <Button onClick={() => setLocation('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{isOwnProfile ? 'Your Hive Statistics' : `${user.username}'s Hive Statistics`}</h1>
          <p className="text-muted-foreground mt-1">
            {isOwnProfile ? 'View your account stats, power metrics, and witness votes' : `View ${user.username}'s stats, power metrics, and witness votes`}
          </p>
        </div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          disabled={isRefreshing}
        >
          <span className="material-symbols-outlined mr-2">
            {isRefreshing ? 'sync' : 'refresh'}
          </span>
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

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
              {user?.proxy ? (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Proxy: @{user.proxy}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-primary/10">
                  {user?.witnessVotes?.length || 0}/30 witness votes
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for different stats */}
        <Card>
          <CardHeader>
            <Tabs defaultValue="power">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="power">Power Analysis</TabsTrigger>
                <TabsTrigger value="votes">Witness Votes</TabsTrigger>
              </TabsList>

              <TabsContent value="power" className="mt-4">
                <div className="space-y-4">
                  <CardTitle className="text-xl">Hive Power Breakdown</CardTitle>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Own HP */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Own HP</div>
                          <div className="text-2xl font-bold">{user?.hivePower}</div>
                          <div className="text-xs text-muted-foreground">
                            Hive Power owned directly by this account
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Effective HP */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Effective HP</div>
                          <div className="text-2xl font-bold">{user?.effectiveHivePower}</div>
                          <div className="text-xs text-muted-foreground">
                            Total effective Hive Power including delegations in/out
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Proxied HP */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Proxied HP</div>
                          <div className="text-2xl font-bold">{user?.proxiedHivePower}</div>
                          <div className="text-xs text-muted-foreground">
                            Hive Power proxied to this account by other users
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Governance Power */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Governance Power</div>
                          <div className="text-2xl font-bold">
                            {formatHivePower(
                              (parseFloat(user?.hivePower?.replace(/[^0-9.]/g, '') || '0') + 
                               parseFloat(user?.proxiedHivePower?.replace(/[^0-9.]/g, '') || '0'))
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Voting power for governance decisions and witness votes (own HP + proxied HP)
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="votes" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{isOwnProfile ? 'Your Witness Votes' : `${user?.username}'s Witness Votes`}</CardTitle>
                    {user?.proxy ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Proxy: @{user.proxy}
                      </Badge>
                    ) : (
                      <Badge className="bg-primary text-primary-foreground">
                        {user?.witnessVotes?.length || 0} / 30
                      </Badge>
                    )}
                  </div>

                  {user?.proxy ? (
                    <div className="text-center py-8">
                      <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={`https://images.hive.blog/u/${user.proxy}/avatar`} alt={`@${user.proxy}`} />
                          <AvatarFallback>
                            {user.proxy.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-lg font-medium">@{user.proxy}</p>
                          <p className="text-muted-foreground text-sm">
                            {isOwnProfile ? 'You have delegated your witness votes to this account' : `${user.username} has delegated their witness votes to @${user.proxy}`}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setLocation(`/${user.proxy}`)}
                        >
                          View @{user.proxy}'s Profile
                        </Button>
                      </div>
                    </div>
                  ) : user?.witnessVotes && user.witnessVotes.length > 0 ? (
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
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setLocation(`/witness/${witness}`)}
                            >
                              View Profile
                            </Button>
                            {isOwnProfile && isLoggedIn && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => voteWitness(witness, false)}
                              >
                                Remove Vote
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">{isOwnProfile ? 'You haven\'t voted for any witnesses yet' : `${user?.username} hasn't voted for any witnesses yet`}</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setLocation('/witnesses')}
                      >
                        Browse Witnesses
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}