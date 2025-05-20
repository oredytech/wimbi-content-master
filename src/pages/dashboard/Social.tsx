
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Linkedin, Plus, Twitter, RefreshCw, Calendar, Settings, Trash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import AddSocialAccountModal from '@/components/social/AddSocialAccountModal';
import SchedulePostModal from '@/components/social/SchedulePostModal';

const Social = () => {
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isSchedulePostModalOpen, setIsSchedulePostModalOpen] = useState(false);
  const { socialAccounts, scheduledPosts, toggleSocialConnection, removeSocialAccount, removeScheduledPost } = useAppContext();
  const { toast } = useToast();

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

  const handleRemoveAccount = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le compte ${name} ?`)) {
      removeSocialAccount(id);
      
      toast({
        title: "Compte supprimé",
        description: `Le compte ${name} a été supprimé`,
      });
    }
  };

  const handleToggleConnection = (id: string, name: string, connected: boolean) => {
    toggleSocialConnection(id);
    
    toast({
      title: connected ? "Compte déconnecté" : "Compte connecté",
      description: `Le compte ${name} a été ${connected ? "déconnecté" : "connecté"}`,
    });
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
        <Button onClick={() => setIsAddAccountModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un réseau
        </Button>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Comptes connectés</TabsTrigger>
          <TabsTrigger value="scheduled">Publications planifiées</TabsTrigger>
          <TabsTrigger value="analytics">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="grid gap-4 md:grid-cols-2">
          {socialAccounts.length > 0 ? (
            socialAccounts.map((account) => {
              const IconComponent = getIconComponent(account.name);
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${account.connected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {account.connected ? "Connecté" : "Déconnecté"}
                      </span>
                    </div>
                    <CardDescription>
                      {account.username}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    {account.connected ? (
                      <>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleToggleConnection(account.id, account.name, account.connected)}
                          >
                            <Settings className="mr-1 h-3.5 w-3.5" />
                            Déconnecter
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleRemoveAccount(account.id, account.name)}
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
                        onClick={() => handleToggleConnection(account.id, account.name, account.connected)}
                      >
                        Connecter
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <Card className="md:col-span-2">
              <CardContent className="p-8 text-center">
                <div className="rounded-full bg-muted/50 p-6 mx-auto w-fit">
                  <Settings className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Aucun réseau social</h3>
                <p className="text-muted-foreground">Connectez vos premiers réseaux sociaux pour commencer à publier</p>
                <Button className="mt-4" onClick={() => setIsAddAccountModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un réseau social
                </Button>
              </CardContent>
            </Card>
          )}
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
              {scheduledPosts.length > 0 ? (
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
                    <div className="col-span-5">Contenu</div>
                    <div className="col-span-3">Date</div>
                    <div className="col-span-3">Plateformes</div>
                    <div className="col-span-1"></div>
                  </div>
                  
                  {scheduledPosts.map((post) => (
                    <div key={post.id} className="grid grid-cols-12 gap-4 p-4 border-t items-center">
                      <div className="col-span-5 truncate">{post.content}</div>
                      <div className="col-span-3 text-sm">
                        {new Date(post.date).toLocaleString('fr-FR')}
                      </div>
                      <div className="col-span-3 flex gap-1">
                        {post.platforms.map((platform) => {
                          const Icon = getIconComponent(platform);
                          let color = "";
                          
                          switch (platform) {
                            case 'Facebook':
                              color = "text-blue-600";
                              break;
                            case 'Twitter':
                              color = "text-sky-500";
                              break;
                            case 'Instagram':
                              color = "text-pink-600";
                              break;
                            case 'LinkedIn':
                              color = "text-blue-700";
                              break;
                            default:
                              color = "text-gray-500";
                          }
                          
                          return <Icon key={platform} className={`h-4 w-4 ${color}`} />;
                        })}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleRemovePost(post.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                  <h3 className="mt-2 text-lg font-medium">Aucune publication planifiée</h3>
                  <p className="text-muted-foreground">Planifiez votre première publication sur les réseaux sociaux</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setIsSchedulePostModalOpen(true)}
                    disabled={!socialAccounts.some(a => a.connected)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Planifier une publication
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des réseaux sociaux</CardTitle>
              <CardDescription>
                Suivez les performances de vos publications sur les réseaux sociaux
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="rounded-full bg-muted/50 p-6 mx-auto w-fit">
                  <Settings className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Module statistiques</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Le module d'analyse des statistiques sera disponible prochainement
                </p>
                <Button className="mt-4" variant="outline">
                  Être notifié
                </Button>
              </div>
            </CardContent>
          </Card>
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
