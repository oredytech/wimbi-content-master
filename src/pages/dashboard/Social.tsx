
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, HelpCircle, Calendar, Users, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import AddSocialAccountModal from '@/components/social/AddSocialAccountModal';
import SchedulePostModal from '@/components/social/SchedulePostModal';
import { getAccessToken, removeAccessToken } from '@/services/oauthService';
import { SocialPlatform } from '@/config/socialConfig';
import SocialAccountList from './social/SocialAccountList';
import EmptyState from './social/EmptyState';
import ScheduledPostsList from './social/ScheduledPostsList';
import AnalyticsTab from './social/AnalyticsTab';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { getSavedFacebookData, hasFacebookPages } from '@/services/oauth/facebookAuthService';
import { useLocation } from 'react-router-dom';

const Social = () => {
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isSchedulePostModalOpen, setIsSchedulePostModalOpen] = useState(false);
  const { socialAccounts, scheduledPosts, toggleSocialConnection, removeSocialAccount, removeScheduledPost } = useAppContext();
  const { toast } = useToast();
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const [facebookData, setFacebookData] = useState<any>(null);
  const location = useLocation();

  // Vérifier les tokens réellement présents au chargement
  useEffect(() => {
    const platforms: SocialPlatform[] = ["facebook", "twitter", "instagram", "linkedin"];
    const connected = platforms.filter(platform => getAccessToken(platform) !== null);
    setConnectedAccounts(connected);
    
    // Récupérer les données Facebook si disponibles
    const fbData = getSavedFacebookData();
    if (fbData) {
      setFacebookData(fbData);
    }
  }, []);

  // Détecter les connexions réussies depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connectedPlatform = params.get('connected');
    
    if (connectedPlatform === 'facebook') {
      // Recharger les données Facebook fraîchement connectées
      const fbData = getSavedFacebookData();
      if (fbData) {
        setFacebookData(fbData);
        toast({
          title: "Facebook connecté avec succès",
          description: `${fbData.pages?.length || 0} page(s) disponible(s) pour publication`,
        });
      }
    }
  }, [location.search, toast]);

  const handleRemoveAccount = (id: string, name: string, platform: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le compte ${name} ?`)) {
      // Supprimer le token d'accès
      removeAccessToken(platform.toLowerCase() as SocialPlatform);
      
      // Supprimer les données Facebook spécifiques
      if (platform.toLowerCase() === 'facebook') {
        localStorage.removeItem('facebook_data');
        setFacebookData(null);
      }
      
      // Supprimer le compte de l'état global
      removeSocialAccount(id);
      
      // Mettre à jour la liste des comptes connectés
      setConnectedAccounts(prev => prev.filter(p => p !== platform.toLowerCase()));
      
      toast({
        title: "Compte supprimé",
        description: `Le compte ${name} a été supprimé`,
      });
    }
  };

  const handleToggleConnection = (id: string, name: string, connected: boolean, platform: string) => {
    if (connected) {
      // Déconnexion
      removeAccessToken(platform.toLowerCase() as SocialPlatform);
      
      if (platform.toLowerCase() === 'facebook') {
        localStorage.removeItem('facebook_data');
        setFacebookData(null);
      }
      
      toggleSocialConnection(id);
      setConnectedAccounts(prev => prev.filter(p => p !== platform.toLowerCase()));
      
      toast({
        title: "Compte déconnecté",
        description: `Le compte ${name} a été déconnecté`,
      });
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
      {facebookData && facebookData.pages && facebookData.pages.length > 0 && (
        <Alert className="bg-blue-50 border-blue-200">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Facebook connecté :</strong> {facebookData.user.name} - {facebookData.pages.length} page(s) disponible(s)
              </div>
              <Users className="h-4 w-4" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {connectedAccounts.length === 0 && (
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
          {socialAccounts.length > 0 ? (
            <SocialAccountList
              accounts={socialAccounts}
              connectedAccounts={connectedAccounts}
              onToggleConnection={handleToggleConnection}
              onRemoveAccount={handleRemoveAccount}
              onAddAccount={() => setIsAddAccountModalOpen(true)}
            />
          ) : null}
          
          <EmptyState 
            onAddAccount={() => setIsAddAccountModalOpen(true)} 
            hasAccounts={socialAccounts.length > 0} 
            anyConnected={socialAccounts.some(a => a.connected)}
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
                <Button onClick={() => setIsSchedulePostModalOpen(true)} disabled={!socialAccounts.some(a => a.connected)}>
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
                socialAccountsConnected={socialAccounts.some(a => a.connected)}
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
