
import React from 'react';
import { Loader2, CheckCircle, XCircle, Users } from 'lucide-react';

interface OAuthStatusProps {
  status: 'processing' | 'success' | 'error';
  errorMessage?: string;
  detailedError?: string;
  connectionDetails?: {
    userInfo?: any;
    pages?: any[];
    pagesCount?: number;
  };
}

const OAuthStatus: React.FC<OAuthStatusProps> = ({
  status,
  errorMessage,
  detailedError,
  connectionDetails
}) => {
  if (status === 'processing') {
    return (
      <>
        <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Connexion en cours</h2>
        <p className="mt-2">Nous finalisons la connexion et sauvegardons vos données...</p>
      </>
    );
  }

  if (status === 'success') {
    return (
      <>
        <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
        <h2 className="mt-4 text-xl font-semibold">Connexion réussie!</h2>
        <p className="mt-2">Vos données ont été sauvegardées de manière sécurisée.</p>
        <p className="mt-2 text-sm text-muted-foreground">Redirection automatique vers le tableau de bord...</p>
        
        {connectionDetails && connectionDetails.pagesCount && connectionDetails.pagesCount > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">
                {connectionDetails.pagesCount} page(s) Facebook connectée(s)
              </span>
            </div>
          </div>
        )}
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <XCircle className="h-8 w-8 mx-auto text-red-600" />
        <h2 className="mt-4 text-xl font-semibold">Erreur de connexion</h2>
        <p className="mt-2 text-red-600">{errorMessage}</p>
        {detailedError && <p className="mt-2">{detailedError}</p>}
      </>
    );
  }

  return null;
};

export default OAuthStatus;
