
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart, Calendar, FileText, Globe, Plus, Share2, TrendingUp } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const Dashboard = () => {
  const { wordpressSites, socialAccounts, scheduledPosts, recentPublications } = useAppContext();
  
  // Calculer le nombre de réseaux sociaux connectés
  const connectedSocialAccounts = socialAccounts.filter(account => account.connected);
  
  // Calculer le nombre de sites WordPress connectés
  const connectedWordPressSites = wordpressSites.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace Wimbi Master.</p>
        </div>
        <Link to="/dashboard/new-content">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau contenu
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Publications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentPublications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sites WordPress
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedWordPressSites}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {connectedWordPressSites > 0 
                ? `${connectedWordPressSites} site${connectedWordPressSites > 1 ? 's' : ''} connecté${connectedWordPressSites > 1 ? 's' : ''}`
                : "Aucun site connecté"
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Réseaux sociaux
            </CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedSocialAccounts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {connectedSocialAccounts.length > 0 
                ? connectedSocialAccounts.map(account => account.name).join(', ')
                : "Aucun réseau connecté"
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Publications planifiées
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledPosts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pour les 7 prochains jours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Publications */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Publications récentes</CardTitle>
            <CardDescription>
              Vos derniers contenus publiés
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPublications.length > 0 ? (
              <div className="space-y-4">
                {recentPublications.map((pub) => (
                  <div key={pub.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{pub.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(pub.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center" title="Sites WordPress">
                        <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">{pub.wordpress}</span>
                      </div>
                      <div className="flex items-center" title="Réseaux sociaux">
                        <Share2 className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">{pub.social}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                <h3 className="mt-2 text-lg font-medium">Aucune publication</h3>
                <p className="text-muted-foreground">Commencez à créer du contenu pour voir vos publications ici</p>
              </div>
            )}
            <div className="mt-4 text-center">
              <Link to="/dashboard/contents">
                <Button variant="outline" size="sm">
                  Voir tous les contenus
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Statistiques de performance</CardTitle>
            <CardDescription>
              Aperçu de l'engagement de vos contenus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex flex-col items-center justify-center text-center border rounded-md bg-gray-50">
              <BarChart className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Les statistiques seront disponibles après publication de votre contenu
              </p>
              <Link to="/dashboard/new-content" className="mt-4">
                <Button variant="outline" size="sm">
                  Publier du contenu
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-wimbi" />
            Suggestions d'optimisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedSocialAccounts.length < 3 && (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h4 className="font-medium text-blue-800">Connectez plus de réseaux sociaux</h4>
                <p className="text-blue-600 text-sm mt-1">
                  Augmentez votre portée en ajoutant tous vos réseaux sociaux à votre compte Wimbi Master.
                </p>
                <Link to="/dashboard/social" className="mt-2 inline-block">
                  <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-100">
                    Connecter un réseau
                  </Button>
                </Link>
              </div>
            )}
            
            {connectedWordPressSites === 0 && (
              <div className="bg-green-50 p-4 rounded-md border border-green-100">
                <h4 className="font-medium text-green-800">Connectez votre site WordPress</h4>
                <p className="text-green-600 text-sm mt-1">
                  Liez votre site WordPress pour pouvoir publier facilement depuis Wimbi Master.
                </p>
                <Link to="/dashboard/wordpress" className="mt-2 inline-block">
                  <Button variant="outline" size="sm" className="text-green-700 border-green-200 hover:bg-green-100">
                    Connecter un site
                  </Button>
                </Link>
              </div>
            )}
            
            <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
              <h4 className="font-medium text-purple-800">Activez la génération de titres par IA</h4>
              <p className="text-purple-600 text-sm mt-1">
                Laissez notre IA générer des titres accrocheurs pour augmenter votre taux de clics.
              </p>
              <Link to="/dashboard/settings" className="mt-2 inline-block">
                <Button variant="outline" size="sm" className="text-purple-700 border-purple-200 hover:bg-purple-100">
                  Activer l'option
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
