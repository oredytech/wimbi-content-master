
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Plus, ExternalLink, Settings, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WordPress = () => {
  // Données fictives pour les sites WordPress
  const sites = [
    { id: 1, name: "Blog Marketing", url: "https://blog-marketing.com", status: "connected", posts: 24 },
    { id: 2, name: "Site E-commerce", url: "https://mon-ecommerce.com", status: "connected", posts: 12 },
    { id: 3, name: "Site Corporate", url: "https://entreprise.com", status: "connected", posts: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites WordPress</h1>
          <p className="text-muted-foreground">Connectez et gérez vos sites WordPress.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Connecter un site
        </Button>
      </div>

      <Tabs defaultValue="sites" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sites">Sites connectés</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sites" className="space-y-4">
          {sites.map((site) => (
            <Card key={site.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <CardTitle>{site.name}</CardTitle>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connecté
                  </span>
                </div>
                <CardDescription>
                  <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                    {site.url}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{site.posts}</span> articles publiés
                  </div>
                  <div className="text-muted-foreground">
                    Dernière synchronisation: il y a 2 heures
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between">
                <Button variant="outline" size="sm">
                  <Settings className="mr-1 h-3.5 w-3.5" />
                  Paramètres
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-1 h-3.5 w-3.5" />
                  Synchroniser
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {sites.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Globe className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                <h3 className="mt-2 text-lg font-medium">Aucun site WordPress connecté</h3>
                <p className="text-muted-foreground">Connectez un site WordPress pour commencer à publier du contenu.</p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Connecter un site WordPress
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres WordPress</CardTitle>
              <CardDescription>
                Configurez les options de publication et d'authentification WordPress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Options de publication</h3>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Publication automatique</span>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Format d'image par défaut</span>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Options d'authentification</h3>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Méthode d'authentification</span>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Renouvellement automatique des tokens</span>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button>Enregistrer les modifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WordPress;
