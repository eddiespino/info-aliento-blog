import { useNetworkStats, useHiveNodes } from '@/hooks/useNetworkStats';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function NetworkStatus() {
  const { stats, isLoading: statsLoading } = useNetworkStats();
  const { nodes, isLoading: nodesLoading } = useHiveNodes();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">Hive Network Status</h2>
        <p className="mt-2 text-muted-foreground">Current state of the Hive blockchain network</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Network Stats Cards */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-full">speed</span>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Block Height</h3>
                {statsLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <p className="text-2xl font-semibold text-foreground">{stats?.blockHeight}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-full">bolt</span>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Transactions/Day</h3>
                {statsLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <p className="text-2xl font-semibold text-foreground">{stats?.txPerDay}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-full">account_balance</span>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Active Witnesses</h3>
                {statsLoading ? (
                  <Skeleton className="h-8 w-10 mt-1" />
                ) : (
                  <p className="text-2xl font-semibold text-foreground">{stats?.activeWitnesses}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-full">trending_up</span>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">HIVE Price</h3>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-semibold text-foreground">{stats?.hivePrice}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* API Nodes Status */}
      <div className="mt-12">
        <h3 className="text-lg font-medium text-foreground mb-4">API Nodes Status</h3>
        
        {/* Desktop View - Table */}
        <div className="hidden md:block">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Node URL</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Tests</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodesLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    nodes.slice(0, 5).map((node, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm font-medium text-primary">
                          {node.url}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {node.version}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {node.lastUpdate}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={node.score === '100%' ? 'default' : 'outline'}
                            className={node.score === '100%' ? 'bg-primary/20 text-primary' : ''}
                          >
                            {node.score}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {node.tests}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
        
        {/* Mobile View - Cards */}
        <div className="md:hidden">
          {nodesLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-5 w-2/3 mb-3" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {nodes.slice(0, 5).map((node, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="p-4 bg-muted/20 border-b border-border flex justify-between items-center">
                    <div className="font-medium text-primary truncate mr-2">{node.url}</div>
                    <Badge 
                      variant={node.score === '100%' ? 'default' : 'outline'}
                      className={node.score === '100%' ? 'bg-primary/20 text-primary' : ''}
                    >
                      {node.score}
                    </Badge>
                  </div>
                  <div className="p-4 text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="text-muted-foreground">Version:</div>
                      <div>{node.version}</div>
                      <div className="text-muted-foreground">Last Update:</div>
                      <div>{node.lastUpdate}</div>
                      <div className="text-muted-foreground">Tests:</div>
                      <div>{node.tests}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
