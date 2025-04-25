import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useKeychain } from '@/context/KeychainContext';
import { useLanguage } from '@/context/LanguageContext';

interface VoteModalProps {
  open: boolean;
  onClose: () => void;
  witness: string;
}

export default function VoteModal({ open, onClose, witness }: VoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { voteWitness } = useKeychain();
  const { t } = useLanguage();

  const [voteError, setVoteError] = useState<string | null>(null);

  const handleVote = async () => {
    setIsSubmitting(true);
    setVoteError(null);
    try {
      const result = await voteWitness(witness, true);
      console.log('Vote result:', result);
      
      if (result.success) {
        onClose();
      } else if (result.error) {
        setVoteError(result.error);
      } else {
        // Generic error if no specific error was provided
        setVoteError('Failed to vote for witness. Please try again.');
      }
    } catch (error) {
      console.error('Error voting for witness:', error);
      setVoteError(typeof error === 'string' ? error : 'An unexpected error occurred during voting.');
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
            {t('modal.vote.title')}
          </DialogTitle>
          <DialogDescription>
            {t('modal.vote.desc')} <strong>@{witness}</strong>. {t('modal.vote.broadcast')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 bg-muted/50 dark:bg-muted/20 p-4 rounded-md">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-muted-foreground">
                {t('witnesses.name')}
              </dt>
              <dd className="mt-1 text-sm font-medium">
                @{witness}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-muted-foreground">
                {t('modal.vote.approval')}
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {t('modal.vote.approve')}
              </dd>
            </div>
          </dl>
        </div>
        
        {voteError && (
          <div className="mt-3 text-sm text-destructive bg-destructive/10 p-2 rounded-md">
            <span className="font-medium">{t('error')}:</span> {voteError}
          </div>
        )}
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            {t('modal.vote.cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleVote}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('modal.vote.confirming') : t('modal.vote.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
