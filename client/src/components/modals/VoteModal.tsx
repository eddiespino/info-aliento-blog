import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useKeychain } from '@/context/KeychainContext';

interface VoteModalProps {
  open: boolean;
  onClose: () => void;
  witness: string;
}

export default function VoteModal({ open, onClose, witness }: VoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { voteWitness } = useKeychain();

  const [voteError, setVoteError] = useState<string | null>(null);

  const handleVote = async () => {
    setIsSubmitting(true);
    setVoteError(null);
    try {
      const result = await voteWitness(witness, true);
      if (result.success) {
        onClose();
      } else if (result.error) {
        setVoteError(result.error);
      }
    } catch (error) {
      setVoteError(String(error));
      console.error('Error voting for witness:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">how_to_vote</span>
            Confirm Witness Vote
          </DialogTitle>
          <DialogDescription>
            You are about to vote for witness <strong>@{witness}</strong>. This action will be broadcast to the Hive blockchain.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 bg-muted/50 dark:bg-muted/20 p-4 rounded-md">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-muted-foreground">
                Witness
              </dt>
              <dd className="mt-1 text-sm font-medium">
                @{witness}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-muted-foreground">
                Approval
              </dt>
              <dd className="mt-1 text-sm font-medium">
                Approve
              </dd>
            </div>
          </dl>
        </div>
        
        {voteError && (
          <div className="mt-3 text-sm text-destructive bg-destructive/10 p-2 rounded-md">
            <span className="font-medium">Error:</span> {voteError}
          </div>
        )}
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleVote}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Vote'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
