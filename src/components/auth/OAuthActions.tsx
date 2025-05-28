
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { RefreshCw, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OAuthActionsProps {
  status: 'processing' | 'success' | 'error';
  onRetry: () => void;
  onGoToDashboard: () => void;
}

const OAuthActions: React.FC<OAuthActionsProps> = ({
  status,
  onRetry,
  onGoToDashboard
}) => {
  if (status === 'success') {
    return (
      <div className="mt-4">
        <Button onClick={onGoToDashboard} className="w-full">
          Aller au tableau de bord
        </Button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
        <Button variant="outline" onClick={onRetry} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </Button>
        <Button asChild>
          <Link to="/dashboard" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </Button>
      </CardFooter>
    );
  }

  return null;
};

export default OAuthActions;
