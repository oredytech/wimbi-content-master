
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, HelpCircle, Calendar, Users, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import AddSocialAccountModal from '@/components/social/AddSocialAccountModal';
import SchedulePostModal from '@/components/social/SchedulePostModal';
import { SocialPlatform } from '@/config/socialConfig';
import SocialAccountList from './social/SocialAccountList';
import EmptyState from './social/EmptyState';
import ScheduledPostsList from './social/ScheduledPostsList';
import AnalyticsTab from './social/AnalyticsTab';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { 
  getUserSocialAccounts, 
  removeSocialAccountFromFirebase,
  FirebaseSocialAccount 
} from '@/services/firebase/socialAccountsService';

const Social = () => {
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isSchedulePostModalOpen, setIsSchedulePostModalOpen] = useState(false);
  const { socialAccounts, scheduledPosts, removeScheduledPost } = useAppContext();
  const { toast } = useToast();
  const [firebaseSocialAccounts, setFirebaseSocialAccounts] = useState<FirebaseSocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Charger les comptes sociaux depuis Firebase
  useEffect(() => {
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

    loadSocialAccounts();
  }, [toast]);

  // Détecter les connexions réussies depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connectedPlatform = params.get('connected');
    
    if (connectedPlatform === 'facebook') {
      // Recharger les comptes depuis Firebase
      getUserSocialAccounts().then(accounts => {
        setFirebaseSocialAccounts(accounts);
        const facebookAccount = accounts.find(acc => acc.platform === 'facebook');
        if (facebookAccount) {
          toast({
            title: "Facebook connecté avec succès",
            description: `${facebookAccount.pages?.length || 0} page(s) disponible(s) pour publication`,
          });
        }
      });
    }
  }, [location.search, toast]);

  const handleRemoveAccount = async (id: string, name: string, platform: string) => {
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

  const handleToggleConnection = async (id: string, name: string, connected: boolean, platform: string) => {
    if (connected) {
      // Déconnexion = suppression du compte
      await handleRemoveAccount(id, name, platform);
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
  const facebookAccount = firebaseSocialAccounts.find(acc => acc.platform === 'facebook');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <Button onClick={() => setIsAddAccountModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un réseau
          </Button>
        </div>
      </div>

      {/* Affichage des informations Facebook si connecté */}
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

      {firebaseSocialAccounts.length === 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Vous n'avez pas encore connecté de réseaux sociaux. Connectez vos comptes pour commencer à planifier des publications.
          </AlertDescription>
        </Alert>
      )}

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
              onRemoveAccount={handleRemoveAccount}
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
