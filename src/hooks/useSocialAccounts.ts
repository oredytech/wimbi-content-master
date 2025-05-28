
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getUserSocialAccounts, 
  removeSocialAccountFromFirebase,
  FirebaseSocialAccount 
} from '@/services/firebase/socialAccountsService';
import { SocialPlatform } from '@/config/socialConfig';

export const useSocialAccounts = () => {
  const [firebaseSocialAccounts, setFirebaseSocialAccounts] = useState<FirebaseSocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSocialAccounts = async () => {
    try {
      const accounts = await getUserSocialAccounts();
      setFirebaseSocialAccounts(accounts);
      console.log(`[Social] ${accounts.length} comptes chargés depuis Firebase`);
    } catch (error) {
      console.error('[Social] Erreur lors du chargement des comptes:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos comptes sociaux",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeAccount = async (id: string, name: string, platform: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le compte ${name} ?`)) {
      try {
        await removeSocialAccountFromFirebase(platform.toLowerCase() as SocialPlatform);
        
        // Mettre à jour l'état local
        setFirebaseSocialAccounts(prev => 
          prev.filter(acc => acc.platform !== platform.toLowerCase())
        );
        
        toast({
          title: "Compte supprimé",
          description: `Le compte ${name} a été supprimé`,
        });
      } catch (error) {
        console.error('[Social] Erreur lors de la suppression:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le compte",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    loadSocialAccounts();
  }, []);

  return {
    firebaseSocialAccounts,
    setFirebaseSocialAccounts,
    loading,
    loadSocialAccounts,
    removeAccount
  };
};
