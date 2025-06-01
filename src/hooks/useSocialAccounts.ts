
import { useState, useEffect } from 'react';
import { useFirebaseErrorHandler } from '@/services/firebase/errorService';
import { 
  getUserSocialAccounts, 
  removeSocialAccountFromFirebase,
  FirebaseSocialAccount 
} from '@/services/firebase/socialAccountsService';
import { SocialPlatform } from '@/config/socialConfig';

export const useSocialAccounts = () => {
  const [firebaseSocialAccounts, setFirebaseSocialAccounts] = useState<FirebaseSocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useFirebaseErrorHandler();

  const loadSocialAccounts = async () => {
    try {
      const accounts = await getUserSocialAccounts();
      setFirebaseSocialAccounts(accounts);
      console.log(`[Social] ${accounts.length} comptes chargés`);
    } catch (error) {
      handleError(error, "Chargement des comptes");
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
        
        console.log(`[Social] Compte ${name} supprimé avec succès`);
      } catch (error) {
        handleError(error, "Suppression du compte");
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
