import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useKeychain } from '@/context/KeychainContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Download } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isKeychainInstalled, login, isDevelopmentMode } = useKeychain();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim()) return;
    
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      const result = await login(username);
      if (result.success) {
        onClose();
      } else if (result.error) {
        setLoginError(result.error);
      }
    } catch (error) {
      setLoginError(String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear username when modal closes
  useEffect(() => {
    if (!open) {
      setUsername('');
      setLoginError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">login</span>
            Login with Hive Keychain
          </DialogTitle>
          <DialogDescription>
            Please ensure you have Hive Keychain extension installed to login. This will allow you to vote for witnesses and interact with the Hive blockchain.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-5 bg-muted/50 dark:bg-muted/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Hive Keychain Status:</span>
            <Badge variant={isKeychainInstalled ? "success" : "destructive"}>
              {isKeychainInstalled ? 'Detected' : 'Not Detected'}
            </Badge>
          </div>
          
          {isDevelopmentMode && !isKeychainInstalled && (
            <Alert variant="info" className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Development mode is active. You can log in with any username for testing.
              </AlertDescription>
            </Alert>
          )}
          
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginError}
              </AlertDescription>
            </Alert>
          )}
          
          {isKeychainInstalled || isDevelopmentMode ? (
            <div>
              <Label htmlFor="usernameInput" className="block text-sm font-medium mb-1">
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
              <p className="text-sm text-muted-foreground mb-3">Hive Keychain extension is required</p>
              <a 
                href="https://hive-keychain.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-sm text-primary hover:text-primary/80"
              >
                <Download className="mr-1 h-4 w-4" />
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
            disabled={(!isKeychainInstalled && !isDevelopmentMode) || !username.trim() || isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
