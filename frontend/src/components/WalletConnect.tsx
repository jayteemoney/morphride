import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';
import { ConnectKitButton } from 'connectkit';

export const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address] = useState('0x742d35Cc6bF4532C7b42a1234');

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    // <Button onClick={handleConnect} variant="outline" size="sm">
    //   <Wallet className="h-4 w-4 mr-2" />
    //   Connect Wallet
    // </Button>
    <ConnectKitButton />
  );
};