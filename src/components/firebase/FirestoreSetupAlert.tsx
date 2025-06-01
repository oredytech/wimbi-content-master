
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { FIRESTORE_RULES, SETUP_INSTRUCTIONS } from '@/services/firebase/firestoreRules';

interface FirestoreSetupAlertProps {
  show: boolean;
  onDismiss: () => void;
}

const FirestoreSetupAlert: React.FC<FirestoreSetupAlertProps> = ({ show, onDismiss }) => {
  const copyRulesToClipboard = () => {
    navigator.clipboard.writeText(FIRESTORE_RULES);
  };

  const openFirebaseConsole = () => {
    window.open('https://console.firebase.google.com/project/wimbimaster-f7d57/firestore/rules', '_blank');
  };

  if (!show) return null;

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">Configuration Firestore requise</AlertTitle>
      <AlertDescription className="text-orange-700">
        <div className="space-y-4">
          <p>
            Les règles de sécurité Firestore doivent être configurées pour permettre 
            la sauvegarde des comptes sociaux.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openFirebaseConsole}
              className="text-orange-700 border-orange-300"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Ouvrir Firebase Console
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyRulesToClipboard}
              className="text-orange-700 border-orange-300"
            >
              Copier les règles
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDismiss}
              className="text-orange-600"
            >
              Masquer
            </Button>
          </div>
          
          <details className="text-sm">
            <summary className="cursor-pointer font-medium mb-2">
              Instructions détaillées
            </summary>
            <pre className="bg-orange-100 p-2 rounded text-xs overflow-auto">
              {SETUP_INSTRUCTIONS}
            </pre>
          </details>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default FirestoreSetupAlert;
