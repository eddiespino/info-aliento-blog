import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useKeychain } from '@/context/KeychainContext';
import { useLanguage } from '@/context/LanguageContext';
import { Trash2, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LoginModal from './LoginModal';

interface UserSwitchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UserSwitchModal({ open, onClose }: UserSwitchModalProps) {
  const { getSavedUsers, switchUser, removeUser, user: currentUser } = useKeychain();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const savedUsers = getSavedUsers();

  const handleSwitchUser = async (username: string) => {
    if (username === currentUser?.username) {
      onClose();
      return;
    }

    setIsLoading(username);
    try {
      const success = await switchUser(username);
      if (success) {
        onClose();
      }
    } finally {
      setIsLoading(null);
    }
  };

  const handleRemoveUser = (username: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeUser(username);
  };

  const handleAddNewUser = () => {
    setLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
    // If a new user was added, close this modal too
    if (currentUser) {
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-symbols-outlined">people</span>
              Switch User Account
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {savedUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No saved accounts found</p>
                <Button onClick={handleAddNewUser} className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Account
                </Button>
              </div>
            ) : (
              <>
                {savedUsers.map((userData) => (
                  <div
                    key={userData.username}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      userData.username === currentUser?.username
                        ? 'bg-primary/10 border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleSwitchUser(userData.username)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userData.profileImage} alt={userData.username} />
                      <AvatarFallback>
                        {userData.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">@{userData.username}</p>
                        {userData.username === currentUser?.username && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{userData.hivePower || '0 HP'}</span>
                        {userData.witnessVotes && (
                          <span>• {userData.witnessVotes.length}/30 votes</span>
                        )}
                      </div>
                    </div>

                    {isLoading === userData.username ? (
                      <div className="animate-spin">
                        <span className="material-symbols-outlined text-sm">progress_activity</span>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleRemoveUser(userData.username, e)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button onClick={handleAddNewUser} variant="outline" className="w-full mt-4">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Account
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <LoginModal open={loginModalOpen} onClose={handleLoginModalClose} />
    </>
  );
}