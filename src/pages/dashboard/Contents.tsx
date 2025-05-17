
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Filter, Plus, Search, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Contents = () => {
  // Données fictives pour les contenus
  const contents = [
    { id: 1, title: "Les tendances marketing 2025", date: "2025-05-15", status: "published", type: "article" },
    { id: 2, title: "Comment optimiser son SEO", date: "2025-05-10", status: "published", type: "article" },
    { id: 3, title: "Guide des réseaux sociaux", date: "2025-05-05", status: "published", type: "guide" },
    { id: 4, title: "Stratégies d'email marketing", date: "2025-05-02", status: "draft", type: "article" },
    { id: 5, title: "Analyse de performance des campagnes", date: "2025-04-28", status: "draft", type: "rapport" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Contenus</h1>
          <p className="text-muted-foreground">Gérez tous vos contenus depuis cette interface.</p>
        </div>
        <Link to="/dashboard/new-content">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau contenu
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bibliothèque de contenus</CardTitle>
          <CardDescription>
            Tous vos articles, guides et rapports disponibles sur vos plateformes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="published">Publiés</TabsTrigger>
              <TabsTrigger value="draft">Brouillons</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-8" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
              <Button variant="outline" size="sm">
                <SortDesc className="mr-2 h-4 w-4" />
                Trier
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
              <div className="col-span-6">Titre</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Statut</div>
            </div>
            
            {contents.map((content) => (
              <div key={content.id} className="grid grid-cols-12 gap-4 p-4 border-t items-center hover:bg-muted/20">
                <div className="col-span-6 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{content.title}</span>
                </div>
                <div className="col-span-2 capitalize text-sm">{content.type}</div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {new Date(content.date).toLocaleDateString('fr-FR')}
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    content.status === "published" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {content.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </div>
              </div>
            ))}

            {contents.length === 0 && (
              <div className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                <h3 className="mt-2 text-lg font-medium">Aucun contenu</h3>
                <p className="text-muted-foreground">Vous n'avez pas encore créé de contenu.</p>
                <Button className="mt-4" asChild>
                  <Link to="/dashboard/new-content">Créer un contenu</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm">
              Suivant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contents;
