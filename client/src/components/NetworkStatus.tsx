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
          <Card className="overflow-hidden border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-medium">Node URL</TableHead>
                    <TableHead className="font-medium">Version</TableHead>
                    <TableHead className="font-medium text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodesLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    nodes.slice(0, 10).map((node, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                        <TableCell className="text-sm font-medium text-primary hover:text-primary/80">
                          <a href={node.url.startsWith('http') ? node.url : `https://${node.url}`} target="_blank" rel="noopener noreferrer">
                            {node.url}
                          </a>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {node.version}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant={node.score === '100%' ? 'default' : 'outline'}
                            className={`${node.score === '100%' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'} min-w-[60px] text-center`}
                          >
                            {node.score}
                          </Badge>
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
        <div className="md:hidden space-y-4">
          {nodesLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-5 w-2/3 mb-3" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {nodes.slice(0, 10).map((node, index) => (
                <Card key={index} className="overflow-hidden border-border">
                  <div className="p-4 bg-muted/30 border-b border-border flex justify-between items-center">
                    <div className="font-medium text-primary truncate mr-2">
                      <a href={node.url.startsWith('http') ? node.url : `https://${node.url}`} target="_blank" rel="noopener noreferrer">
                        {node.url}
                      </a>
                    </div>
                    <Badge 
                      variant={node.score === '100%' ? 'default' : 'outline'}
                      className={`${node.score === '100%' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'} min-w-[60px] text-center`}
                    >
                      {node.score}
                    </Badge>
                  </div>
                  <div className="p-4 text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="text-muted-foreground">Version:</div>
                      <div>{node.version}</div>
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
