
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseOAuthMessageHandlerProps {
  onSuccess: () => void;
  onCloseModal: () => void;
}

export const useOAuthMessageHandler = ({ onSuccess, onCloseModal }: UseOAuthMessageHandlerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      // Vérifier l'origine du message pour la sécurité
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'oauth_success') {
        console.log('[Social] Connexion OAuth réussie:', event.data);
        
        // Fermer le modal d'ajout de compte
        onCloseModal();
        
        // Recharger les comptes sociaux
        await onSuccess();
        
        // Afficher un toast de succès avec les détails du compte
        const { platform, account } = event.data;
        
        if (platform === 'facebook' && account?.pagesCount > 0) {
          toast({
            title: "Facebook connecté avec succès",
            description: `Compte ${account.userInfo?.name || account.username} connecté avec ${account.pagesCount} page(s) disponible(s)`,
          });
        } else {
          toast({
            title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} connecté`,
            description: `Compte ${account?.userInfo?.name || account?.username || platform} connecté avec succès`,
          });
        }
      } else if (event.data.type === 'oauth_error') {
        console.error('[Social] Erreur OAuth:', event.data.error);
        
        toast({
          title: "Erreur de connexion",
          description: event.data.error,
          variant: "destructive",
        });
      }
    };

    // Ajouter l'écouteur d'événements
    window.addEventListener('message', handleOAuthMessage);

    // Nettoyer l'écouteur lors du démontage
    return () => {
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, [onSuccess, onCloseModal, toast]);
};
