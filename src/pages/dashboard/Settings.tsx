
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, User, CreditCard, Key, Bell, FileText } from 'lucide-react';

const Settings = () => {
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
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles et votre profil public
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" defaultValue="Jean Dupont" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input id="email" type="email" defaultValue="jean.dupont@exemple.fr" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="company">Entreprise</Label>
                <Input id="company" defaultValue="Marketing Genius" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" defaultValue="Spécialiste en marketing digital et content manager" />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button>Mettre à jour le profil</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>
                Gérez votre mot de passe et les paramètres de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">Activer l'authentification à deux facteurs</Button>
              <Button>Mettre à jour le mot de passe</Button>
            </CardFooter>
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
                  <Button variant="outline">Configurer</Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Notifications push</h3>
                    <p className="text-sm text-muted-foreground">Recevoir des notifications dans l'application</p>
                  </div>
                  <Button variant="outline">Configurer</Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Alertes de publication</h3>
                    <p className="text-sm text-muted-foreground">Notifications pour les publications planifiées</p>
                  </div>
                  <Button variant="outline">Configurer</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button>Enregistrer les préférences</Button>
            </CardFooter>
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
                  <Input id="api-key" defaultValue="sk_live_WimbiMaster_8x7dQ9p2z5" type="password" />
                  <Button variant="outline">Afficher</Button>
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
                    <Button variant="outline" size="sm">Configurer</Button>
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
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">Révoquer toutes les clés</Button>
              <Button>Générer une nouvelle clé</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
