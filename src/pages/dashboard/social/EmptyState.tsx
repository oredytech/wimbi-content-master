
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Plus, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

interface EmptyStateProps {
  onAddAccount: () => void;
  hasAccounts: boolean;
  anyConnected: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddAccount, hasAccounts, anyConnected }) => {
  if (!hasAccounts) {
    return (
      <Card className="md:col-span-2">
        <CardContent className="p-8 text-center">
          <div className="rounded-full bg-muted/50 p-6 mx-auto w-fit">
            <Settings className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Aucun réseau social</h3>
          <p className="text-muted-foreground">Connectez vos premiers réseaux sociaux pour commencer à publier</p>
          <Button className="mt-4" onClick={onAddAccount}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un réseau social
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (hasAccounts && !anyConnected) {
    return (
      <Card className="md:col-span-2 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <Alert className="bg-transparent border-0 p-0">
            <div className="flex items-center">
              <div className="mr-2 rounded-full bg-blue-100 p-1">
                <HelpCircle className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-800">Connexion requise</h4>
                <p className="text-sm text-blue-700">
                  Vous devez connecter au moins un réseau social pour pouvoir publier du contenu.
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 text-blue-700 border-blue-300"
                  onClick={onAddAccount}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Connecter un réseau social
                </Button>
              </div>
            </div>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default EmptyState;
