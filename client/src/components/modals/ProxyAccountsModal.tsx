import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProxyAccounts } from '@/hooks/useWitnesses';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProxyAccount } from '@/types/hive';
import { useLanguage } from '@/context/LanguageContext';

interface ProxyAccountsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export default function ProxyAccountsModal({ open, onOpenChange, username }: ProxyAccountsModalProps) {
  const { proxyAccounts, isLoading } = useProxyAccounts(username);
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('modal.proxy.title')} @{username}</DialogTitle>
          <DialogDescription>
            {t('modal.proxy.desc')} @{username}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : proxyAccounts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {proxyAccounts.map((account) => (
                <ProxyAccountCard key={account.username} account={account} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {t('modal.proxy.noAccounts')} @{username} {t('modal.proxy.asProxy')}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProxyAccountCard({ account }: { account: ProxyAccount }) {
  const { t } = useLanguage();
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={account.profileImage} alt={account.username} />
            <AvatarFallback>{account.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">@{account.username}</div>
            <div className="text-sm text-muted-foreground">{account.hivePower}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}