import { Button } from '@/components/ui/button';
import { useKeychain } from '@/context/KeychainContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ViewOnlyToggle() {
  const { viewOnlyMode, setViewOnlyMode } = useKeychain();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewOnlyMode ? "default" : "outline"}
            size="sm"
            onClick={() => setViewOnlyMode(!viewOnlyMode)}
            className="h-9 px-3"
          >
            <span className="material-symbols-outlined text-sm">
              {viewOnlyMode ? 'visibility' : 'visibility_off'}
            </span>
            <span className="ml-1 hidden sm:inline text-xs">
              {viewOnlyMode ? 'View Only' : 'Auth Only'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-sm">
            {viewOnlyMode 
              ? 'View-only mode enabled: explore any account without authentication'
              : 'Authentication required: only view authenticated accounts'
            }
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Click to {viewOnlyMode ? 'disable' : 'enable'} view-only mode
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}