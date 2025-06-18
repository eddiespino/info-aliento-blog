import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useKeychain } from '@/context/KeychainContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ViewOnlyModeToggle() {
  const { viewOnlyMode, setViewOnlyMode } = useKeychain();

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="material-symbols-outlined">visibility</span>
          View-Only Mode
        </CardTitle>
        <CardDescription>
          Allow viewing account data without authentication for exploring witness votes of other users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Label htmlFor="view-only-mode" className="text-sm font-medium">
            {viewOnlyMode ? 'Currently Enabled' : 'Currently Disabled'}
          </Label>
          <Button
            variant={viewOnlyMode ? "destructive" : "default"}
            size="sm"
            onClick={() => setViewOnlyMode(!viewOnlyMode)}
          >
            {viewOnlyMode ? 'Disable' : 'Enable'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {viewOnlyMode 
            ? 'You can view any account\'s witness votes and stats. Voting requires authentication.'
            : 'Only authenticated accounts can be viewed. More secure but limits exploration.'
          }
        </p>
      </CardContent>
    </Card>
  );
}