import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useKeychain } from '@/context/KeychainContext';
import { useLanguage } from '@/context/LanguageContext';
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
  const { t } = useLanguage();
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
        // Format error message in a more user-friendly way
        let errorMessage = result.error;
        
        if (result.error.includes('does not exist on the Hive blockchain')) {
          errorMessage = `@${username.trim().toLowerCase()} is not a valid Hive account.`;
        } else if (result.error.includes('Account not found in your Hive Keychain')) {
          errorMessage = `@${username.trim().toLowerCase()} is not found in your Hive Keychain. Make sure you have added this account to Keychain.`;
        }
        
        setLoginError(errorMessage);
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
            {t('modal.login.title')}
          </DialogTitle>
          <DialogDescription>
            {t('modal.login.desc')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-5 bg-muted/50 dark:bg-muted/20 rounded-lg">
          {isDevelopmentMode && !isKeychainInstalled && (
            <Alert className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('modal.login.devMode')}
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
                {t('modal.login.username')}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  id="usernameInput"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('modal.login.enterUsername')}
                  className="w-full pl-7"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && username.trim()) {
                      handleLogin();
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-3">{t('modal.login.keychain')}</p>
              <a 
                href="https://hive-keychain.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-sm text-primary hover:text-primary/80"
              >
                <Download className="mr-1 h-4 w-4" />
                {t('modal.login.install')}
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
            {t('modal.login.cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleLogin}
            disabled={(!isKeychainInstalled && !isDevelopmentMode) || !username.trim() || isSubmitting}
          >
            {isSubmitting ? t('modal.login.logging') : t('login')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
