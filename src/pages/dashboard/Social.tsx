
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { useSocialAccounts } from '@/hooks/useSocialAccounts';
import { useOAuthMessageHandler } from '@/hooks/useOAuthMessageHandler';
import SocialHeader from '@/components/social/SocialHeader';
import SocialAlerts from '@/components/social/SocialAlerts';
import SocialTabs from '@/components/social/SocialTabs';
import FirestoreSetupAlert from '@/components/firebase/FirestoreSetupAlert';
import AddSocialAccountModal from '@/components/social/AddSocialAccountModal';
import SchedulePostModal from '@/components/social/SchedulePostModal';

const Social = () => {
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isSchedulePostModalOpen, setIsSchedulePostModalOpen] = useState(false);
  const [showFirestoreAlert, setShowFirestoreAlert] = useState(false);
  const { scheduledPosts, removeScheduledPost } = useAppContext();
  const { toast } = useToast();
  const location = useLocation();
  
  const {
    firebaseSocialAccounts,
    loading,
    loadSocialAccounts,
    removeAccount
  } = useSocialAccounts();

  // Gérer les messages OAuth
  useOAuthMessageHandler({
    onSuccess: loadSocialAccounts,
    onCloseModal: () => setIsAddAccountModalOpen(false)
  });

  // Détecter les connexions réussies depuis l'URL (fallback)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connectedPlatform = params.get('connected');
    
    if (connectedPlatform === 'facebook') {
      loadSocialAccounts().then(() => {
        const facebookAccount = firebaseSocialAccounts.find(acc => acc.platform === 'facebook');
        if (facebookAccount) {
          toast({
            title: "Facebook connecté avec succès",
            description: `${facebookAccount.pages?.length || 0} page(s) disponible(s) pour publication`,
          });
        }
      });
    }
  }, [location.search, toast, loadSocialAccounts, firebaseSocialAccounts]);

  // Détecter les erreurs de permissions et afficher l'alerte
  useEffect(() => {
    const checkForPermissionErrors = () => {
      const lastError = localStorage.getItem('last_firebase_error');
      if (lastError) {
        try {
          const errorData = JSON.parse(lastError);
          if (errorData.code === 'permission-denied') {
            setShowFirestoreAlert(true);
            localStorage.removeItem('last_firebase_error');
          }
        } catch (e) {
          // Ignorer les erreurs de parsing
        }
      }
    };

    checkForPermissionErrors();
  }, []);

  const handleToggleConnection = async (id: string, name: string, connected: boolean, platform: string) => {
    if (connected) {
      // Déconnexion = suppression du compte
      await removeAccount(id, name, platform);
    } else {
      // Tentative de reconnexion
      setIsAddAccountModalOpen(true);
    }
  };

  const handleRemovePost = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette publication planifiée ?")) {
      removeScheduledPost(id);
      
      toast({
        title: "Publication supprimée",
        description: "La publication planifiée a été supprimée",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SocialHeader onAddAccount={() => setIsAddAccountModalOpen(true)} />
      
      <FirestoreSetupAlert 
        show={showFirestoreAlert} 
        onDismiss={() => setShowFirestoreAlert(false)} 
      />
      
      <SocialAlerts accounts={firebaseSocialAccounts} />

      <SocialTabs
        firebaseSocialAccounts={firebaseSocialAccounts}
        scheduledPosts={scheduledPosts}
        onAddAccount={() => setIsAddAccountModalOpen(true)}
        onSchedulePost={() => setIsSchedulePostModalOpen(true)}
        onToggleConnection={handleToggleConnection}
        onRemoveAccount={removeAccount}
        onRemovePost={handleRemovePost}
      />

      <AddSocialAccountModal 
        isOpen={isAddAccountModalOpen} 
        onClose={() => setIsAddAccountModalOpen(false)} 
      />

      <SchedulePostModal
        isOpen={isSchedulePostModalOpen}
        onClose={() => setIsSchedulePostModalOpen(false)}
      />
    </div>
  );
};

export default Social;
