
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import AddSocialAccountModal from '@/components/social/AddSocialAccountModal';
import SchedulePostModal from '@/components/social/SchedulePostModal';
import SocialAccountList from './social/SocialAccountList';
import EmptyState from './social/EmptyState';
import ScheduledPostsList from './social/ScheduledPostsList';
import AnalyticsTab from './social/AnalyticsTab';
import SocialHeader from '@/components/social/SocialHeader';
import SocialAlerts from '@/components/social/SocialAlerts';
import { useLocation } from 'react-router-dom';
import { useSocialAccounts } from '@/hooks/useSocialAccounts';

const Social = () => {
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isSchedulePostModalOpen, setIsSchedulePostModalOpen] = useState(false);
  const { scheduledPosts, removeScheduledPost } = useAppContext();
  const { toast } = useToast();
  const location = useLocation();
  
  const {
    firebaseSocialAccounts,
    setFirebaseSocialAccounts,
    loading,
    loadSocialAccounts,
    removeAccount
  } = useSocialAccounts();

  // Détecter les connexions réussies depuis l'URL
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
  }, [location.search, toast]);

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

  // Transformer les comptes Firebase en format attendu par SocialAccountList
  const transformedAccounts = firebaseSocialAccounts.map(acc => ({
    id: acc.id,
    name: acc.platform.charAt(0).toUpperCase() + acc.platform.slice(1) as any,
    username: acc.username,
    connected: true,
    icon: acc.platform,
    color: getColorForPlatform(acc.platform)
  }));

  function getColorForPlatform(platform: string): string {
    switch (platform) {
      case 'facebook': return "bg-blue-600";
      case 'twitter': return "bg-sky-500";
      case 'instagram': return "bg-pink-600";
      case 'linkedin': return "bg-blue-700";
      default: return "bg-gray-500";
    }
  }

  const connectedPlatforms = firebaseSocialAccounts.map(acc => acc.platform);

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
      
      <SocialAlerts accounts={firebaseSocialAccounts} />

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Comptes connectés</TabsTrigger>
          <TabsTrigger value="scheduled">Publications planifiées</TabsTrigger>
          <TabsTrigger value="analytics">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="grid gap-4 md:grid-cols-2">
          {transformedAccounts.length > 0 ? (
            <SocialAccountList
              accounts={transformedAccounts}
              connectedAccounts={connectedPlatforms}
              onToggleConnection={handleToggleConnection}
              onRemoveAccount={removeAccount}
              onAddAccount={() => setIsAddAccountModalOpen(true)}
            />
          ) : null}
          
          <EmptyState 
            onAddAccount={() => setIsAddAccountModalOpen(true)} 
            hasAccounts={transformedAccounts.length > 0} 
            anyConnected={transformedAccounts.length > 0}
          />
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle>Publications planifiées</CardTitle>
                </div>
                <Button 
                  onClick={() => setIsSchedulePostModalOpen(true)} 
                  disabled={firebaseSocialAccounts.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Planifier une publication
                </Button>
              </div>
              <CardDescription>
                Gérez vos publications programmées sur tous vos réseaux sociaux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScheduledPostsList 
                posts={scheduledPosts}
                onAddPost={() => setIsSchedulePostModalOpen(true)}
                onRemovePost={handleRemovePost}
                socialAccountsConnected={firebaseSocialAccounts.length > 0}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>

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
