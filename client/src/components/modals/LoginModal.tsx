import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useKeychain } from '@/context/KeychainContext';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isKeychainInstalled, login } = useKeychain();

  const handleLogin = async () => {
    if (!username.trim()) return;
    
    setIsSubmitting(true);
    try {
      const result = await login(username);
      if (result.success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear username when modal closes
  useEffect(() => {
    if (!open) {
      setUsername('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-500">login</span>
            Login with Hive Keychain
          </DialogTitle>
          <DialogDescription>
            Please ensure you have Hive Keychain extension installed to login. This will allow you to vote for witnesses and interact with the Hive blockchain.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-5 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Hive Keychain Status:</span>
            <Badge variant={isKeychainInstalled ? "success" : "destructive"}>
              {isKeychainInstalled ? 'Detected' : 'Not Detected'}
            </Badge>
          </div>
          
          {isKeychainInstalled ? (
            <div>
              <Label htmlFor="usernameInput" className="block text-sm font-medium text-gray-700 mb-1">
                Hive Username
              </Label>
              <Input
                id="usernameInput"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your Hive username"
                className="w-full"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-3">Hive Keychain extension is required</p>
              <a 
                href="https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
              >
                <span className="material-symbols-outlined mr-1">download</span>
                Install Hive Keychain
              </a>
            </div>
          )}
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
            onClick={handleLogin}
            disabled={!isKeychainInstalled || !username.trim() || isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
