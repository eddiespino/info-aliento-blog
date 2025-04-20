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

  const handleVote = async () => {
    setIsSubmitting(true);
    try {
      const result = await voteWitness(witness, true);
      if (result.success) {
        onClose();
      }
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
        
        <div className="mt-4 bg-gray-50 p-4 rounded-md">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Witness
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                @{witness}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Approval
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                Approve
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Required Authority
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                Active Key via Hive Keychain
              </dd>
            </div>
          </dl>
        </div>
        
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
