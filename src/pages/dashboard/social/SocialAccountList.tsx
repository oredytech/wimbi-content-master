
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Linkedin, Twitter, RefreshCw, LogOut, Trash } from 'lucide-react';

interface SocialAccountListProps {
  accounts: {
    id: string;
    name: string;
    username: string;
    connected: boolean;
    icon: string;
    color: string;
  }[];
  connectedAccounts: string[];
  onToggleConnection: (id: string, name: string, connected: boolean, platform: string) => void;
  onRemoveAccount: (id: string, name: string, platform: string) => void;
  onAddAccount: () => void;
}

const SocialAccountList: React.FC<SocialAccountListProps> = ({
  accounts,
  connectedAccounts,
  onToggleConnection,
  onRemoveAccount,
  onAddAccount
}) => {
  const getIconComponent = (name: string) => {
    switch (name) {
      case 'Facebook':
        return Facebook;
      case 'Twitter':
        return Twitter;
      case 'Instagram':
        return Instagram;
      case 'LinkedIn':
        return Linkedin;
      default:
        return Facebook;
    }
  };

  return (
    <>
      {accounts.map((account) => {
        const IconComponent = getIconComponent(account.name);
        const platformName = account.name.toLowerCase();
        const hasToken = connectedAccounts.includes(platformName);
        
        return (
          <Card key={account.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${account.color} text-white`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <CardTitle>{account.name}</CardTitle>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${hasToken ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {hasToken ? "Connecté" : "Déconnecté"}
                </span>
              </div>
              <CardDescription>
                {account.username}
              </CardDescription>
            </CardHeader>
            <CardFooter className="border-t pt-3 flex justify-between">
              {hasToken ? (
                <>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onToggleConnection(account.id, account.name, true, platformName)}
                    >
                      <LogOut className="mr-1 h-3.5 w-3.5" />
                      Déconnecter
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => onRemoveAccount(account.id, account.name, platformName)}
                    >
                      <Trash className="mr-1 h-3.5 w-3.5" />
                      Supprimer
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-1 h-3.5 w-3.5" />
                    Actualiser
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full"
                  onClick={onAddAccount}
                >
                  Connecter
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
};

export default SocialAccountList;
