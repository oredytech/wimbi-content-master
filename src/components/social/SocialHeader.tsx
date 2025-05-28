
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, HelpCircle } from 'lucide-react';

interface SocialHeaderProps {
  onAddAccount: () => void;
}

const SocialHeader: React.FC<SocialHeaderProps> = ({ onAddAccount }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Réseaux Sociaux</h1>
        <p className="text-muted-foreground">Gérez vos comptes sociaux et planifiez vos publications.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <a href="https://help.wimbimaster.com/social-networks" target="_blank" rel="noopener noreferrer">
            <HelpCircle className="mr-2 h-4 w-4" />
            Guide d'utilisation
          </a>
        </Button>
        <Button onClick={onAddAccount}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un réseau
        </Button>
      </div>
    </div>
  );
};

export default SocialHeader;
