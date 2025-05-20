
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, User, CreditCard, Key, Bell, FileText, Check, Eye, EyeOff } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const { userSettings, updateUserProfile, updateUserNotifications, updateApiKey } = useAppContext();
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: userSettings.profile.name,
    email: userSettings.profile.email,
    company: userSettings.profile.company,
    bio: userSettings.profile.bio,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationsForm, setNotificationsForm] = useState({
    email: userSettings.notifications.email,
    push: userSettings.notifications.push,
    publications: userSettings.notifications.publications,
  });
  const [apiKeyForm, setApiKeyForm] = useState(userSettings.apiKey);

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileForm(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [id]: value }));
  };

  const handleNotificationsChange = (key: keyof typeof notificationsForm) => {
    const newValue = !notificationsForm[key];
    setNotificationsForm(prev => ({ ...prev, [key]: newValue }));
    updateUserNotifications({ [key]: newValue });
    
    toast({
      title: "Préférences mises à jour",
      description: `Les notifications ${key} sont maintenant ${newValue ? "activées" : "désactivées"}`,
    });
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeyForm(e.target.value);
  };

  const handleToggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    
    toast({
      title: "Profil mis à jour",
      description: "Vos informations de profil ont été mises à jour",
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      });
      return;
    }
    
    // Simulation de changement de mot de passe
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès",
    });
  };

  const handleGenerateNewApiKey = () => {
    const newApiKey = `sk_live_WimbiMaster_${Math.random().toString(36).substring(2, 10)}`;
    setApiKeyForm(newApiKey);
    updateApiKey(newApiKey);
    
    toast({
      title: "Nouvelle clé API générée",
      description: "Votre clé API a été mise à jour avec succès",
    });
  };

  const handleUpdateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiKey(apiKeyForm);
    
    toast({
      title: "Clé API mise à jour",
      description: "Votre clé API a été enregistrée avec succès",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">Gérez les paramètres de votre compte et vos préférences.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid md:grid-cols-5 grid-cols-2 gap-2 md:gap-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden md:inline">Compte</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Facturation</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">API</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles et votre profil public
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Nom</Label>
                  <Input 
                    id="name" 
                    value={profileForm.name} 
                    onChange={handleProfileFormChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileForm.email} 
                    onChange={handleProfileFormChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="company">Entreprise</Label>
                  <Input 
                    id="company" 
                    value={profileForm.company} 
                    onChange={handleProfileFormChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <Input 
                    id="bio" 
                    value={profileForm.bio} 
                    onChange={handleProfileFormChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-end">
                <Button type="submit">Mettre à jour le profil</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <form onSubmit={handleUpdatePassword}>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Gérez votre mot de passe et les paramètres de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordFormChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFormChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline">Activer l'authentification à deux facteurs</Button>
                <Button type="submit">Mettre à jour le mot de passe</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Configurez comment et quand vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Notifications par e-mail</h3>
                    <p className="text-sm text-muted-foreground">Recevoir des notifications par e-mail</p>
                  </div>
                  <Switch 
                    checked={notificationsForm.email}
                    onCheckedChange={() => handleNotificationsChange('email')}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Notifications push</h3>
                    <p className="text-sm text-muted-foreground">Recevoir des notifications dans l'application</p>
                  </div>
                  <Switch 
                    checked={notificationsForm.push}
                    onCheckedChange={() => handleNotificationsChange('push')}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Alertes de publication</h3>
                    <p className="text-sm text-muted-foreground">Notifications pour les publications planifiées</p>
                  </div>
                  <Switch 
                    checked={notificationsForm.publications}
                    onCheckedChange={() => handleNotificationsChange('publications')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Abonnement et facturation</CardTitle>
              <CardDescription>
                Gérez votre plan actuel et vos informations de paiement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Plan actuel</h3>
                  <span className="text-wimbi font-medium">Pro</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Prix mensuel</span>
                    <span className="font-medium">39,99€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prochaine facturation</span>
                    <span>15 juin 2025</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label>Méthode de paiement</Label>
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span>Visa se terminant par •••• 4242</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <h3 className="font-medium">Historique des factures</h3>
                <div className="border rounded-md">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 text-sm font-medium">
                    <div>Date</div>
                    <div>Montant</div>
                    <div>Statut</div>
                    <div></div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-3 border-t items-center text-sm">
                    <div>15 mai 2025</div>
                    <div>39,99€</div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Payé
                      </span>
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm">
                        Télécharger
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-3 border-t items-center text-sm">
                    <div>15 avril 2025</div>
                    <div>39,99€</div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Payé
                      </span>
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm">
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">Changer de plan</Button>
              <Button>Mettre à jour les informations de paiement</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <form onSubmit={handleUpdateApiKey}>
              <CardHeader>
                <CardTitle>Clés API</CardTitle>
                <CardDescription>
                  Gérez vos clés API pour l'intégration avec d'autres services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="api-key">Clé API</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      value={apiKeyForm} 
                      type={showApiKey ? "text" : "password"}
                      onChange={handleApiKeyChange}
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleToggleApiKeyVisibility}
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4 space-y-4">
                  <h3 className="font-medium">Services connectés</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <div className="font-medium">API WordPress</div>
                        <div className="text-sm text-muted-foreground">Connecté</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Connecté
                        </span>
                        <Button variant="outline" size="sm">Configurer</Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <div className="font-medium">API Meta Business</div>
                        <div className="text-sm text-muted-foreground">Non connecté</div>
                      </div>
                      <Button variant="outline" size="sm">Configurer</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <div className="font-medium">API Twitter</div>
                        <div className="text-sm text-muted-foreground">Connecté</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Connecté
                        </span>
                        <Button variant="outline" size="sm">Configurer</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={handleGenerateNewApiKey}>Générer une nouvelle clé</Button>
                <Button type="submit">Enregistrer</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
