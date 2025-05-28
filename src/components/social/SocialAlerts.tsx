
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { FirebaseSocialAccount } from '@/services/firebase/socialAccountsService';

interface SocialAlertsProps {
  accounts: FirebaseSocialAccount[];
}

const SocialAlerts: React.FC<SocialAlertsProps> = ({ accounts }) => {
  const facebookAccount = accounts.find(acc => acc.platform === 'facebook');

  return (
    <>
      {facebookAccount && facebookAccount.pages && facebookAccount.pages.length > 0 && (
        <Alert className="bg-blue-50 border-blue-200">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Facebook connecté :</strong> {facebookAccount.userInfo?.name} - {facebookAccount.pages.length} page(s) disponible(s)
              </div>
              <Users className="h-4 w-4" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {accounts.length === 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Vous n'avez pas encore connecté de réseaux sociaux. Connectez vos comptes pour commencer à planifier des publications.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SocialAlerts;
