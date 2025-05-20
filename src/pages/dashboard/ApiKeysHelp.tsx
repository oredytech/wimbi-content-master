
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const ApiKeysHelp = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration des API</h1>
        <p className="text-muted-foreground">Comment obtenir les clés API pour connecter vos réseaux sociaux et sites web.</p>
      </div>

      <Tabs defaultValue="facebook" className="space-y-4">
        <TabsList>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="wordpress">WordPress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="facebook">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'API Facebook</CardTitle>
              <CardDescription>
                Suivez ces étapes pour créer une application Facebook et obtenir vos clés API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Étapes pour créer une App Facebook</h3>
              <ol className="space-y-4 list-decimal list-inside">
                <li>
                  <span className="font-medium">Accédez au portail des développeurs Facebook</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Visitez <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook for Developers</a> et connectez-vous avec votre compte Facebook.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Créez une nouvelle application</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Cliquez sur "Mes applications" puis sur "Créer une application". Sélectionnez l'option "Entreprise" comme type d'application.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Configurez votre application</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Remplissez les détails de votre application, comme le nom et l'adresse e-mail de contact.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Ajoutez les produits nécessaires</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Dans le tableau de bord de l'application, ajoutez les produits "Facebook Login" et "Pages API".
                  </p>
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li className="text-sm text-muted-foreground">
                      Pour Facebook Login, configurez les URL de redirection OAuth: <code>{window.location.origin}/auth/callback/facebook</code>
                    </li>
                    <li className="text-sm text-muted-foreground">
                      Configurez les autorisations requises: pages_show_list, pages_read_engagement, pages_manage_posts
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Obtenez vos identifiants</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Dans la section "Paramètres > Général" de votre application, vous trouverez l'ID de l'application et la clé secrète.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Configurez WimbiMaster</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Ajoutez l'ID de l'application à la configuration de WimbiMaster.
                  </p>
                </li>
              </ol>
              
              <div className="pt-4">
                <Button variant="outline" className="flex items-center" asChild>
                  <a href="https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow" target="_blank" rel="noopener noreferrer">
                    Documentation Facebook <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="twitter">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'API Twitter</CardTitle>
              <CardDescription>
                Suivez ces étapes pour créer une application Twitter et obtenir vos clés API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Étapes pour créer une App Twitter</h3>
              <ol className="space-y-4 list-decimal list-inside">
                <li>
                  <span className="font-medium">Accédez au portail développeur Twitter</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Visitez <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Twitter Developer Portal</a> et connectez-vous avec votre compte Twitter.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Créez un nouveau projet</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Cliquez sur "Create Project" et suivez les étapes pour créer un nouveau projet.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Créez une nouvelle application</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Dans votre projet, créez une nouvelle application en cliquant sur "Add App".
                  </p>
                </li>
                <li>
                  <span className="font-medium">Configurez l'authentification OAuth 2.0</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Allez dans "Project Settings" > "Authentication settings", et activez OAuth 2.0.
                  </p>
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li className="text-sm text-muted-foreground">
                      Type d'application: Web App
                    </li>
                    <li className="text-sm text-muted-foreground">
                      URL de redirection: <code>{window.location.origin}/auth/callback/twitter</code>
                    </li>
                    <li className="text-sm text-muted-foreground">
                      Site web: <code>{window.location.origin}</code>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Définissez les autorisations</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Sélectionnez les autorisations (scopes) nécessaires: tweet.read, tweet.write, users.read
                  </p>
                </li>
                <li>
                  <span className="font-medium">Obtenez vos identifiants</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Dans la section "Keys and tokens", vous trouverez votre Client ID et Client Secret.
                  </p>
                </li>
              </ol>
              
              <div className="pt-4">
                <Button variant="outline" className="flex items-center" asChild>
                  <a href="https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code" target="_blank" rel="noopener noreferrer">
                    Documentation Twitter <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instagram">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'API Instagram</CardTitle>
              <CardDescription>
                Instagram utilise l'infrastructure Facebook pour les API. Suivez ces étapes pour configurer l'accès.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Étapes pour configurer l'API Instagram</h3>
              <ol className="space-y-4 list-decimal list-inside">
                <li>
                  <span className="font-medium">Créez une application Facebook</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Suivez d'abord les étapes pour créer une application Facebook, car Instagram utilise la même plateforme.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Ajoutez Instagram à votre application</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Dans le tableau de bord de votre application Facebook, cliquez sur "Ajouter un produit" et sélectionnez "Instagram Basic Display".
                  </p>
                </li>
                <li>
                  <span className="font-medium">Configurez Instagram Basic Display</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Ajoutez les URL de redirection OAuth: <code>{window.location.origin}/auth/callback/instagram</code>
                  </p>
                </li>
                <li>
                  <span className="font-medium">Ajoutez un compte de test Instagram</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Dans les paramètres de l'API Instagram, ajoutez votre compte Instagram comme compte de test.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Configurez les autorisations</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Assurez-vous de demander les autorisations: user_profile, user_media
                  </p>
                </li>
                <li>
                  <span className="font-medium">Utilisez les mêmes identifiants que Facebook</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Utilisez l'ID d'application Facebook pour la configuration d'Instagram dans WimbiMaster.
                  </p>
                </li>
              </ol>
              
              <div className="pt-4">
                <Button variant="outline" className="flex items-center" asChild>
                  <a href="https://developers.facebook.com/docs/instagram-basic-display-api/getting-started" target="_blank" rel="noopener noreferrer">
                    Documentation Instagram <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="linkedin">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'API LinkedIn</CardTitle>
              <CardDescription>
                Suivez ces étapes pour créer et configurer une application LinkedIn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Étapes pour créer une App LinkedIn</h3>
              <ol className="space-y-4 list-decimal list-inside">
                <li>
                  <span className="font-medium">Accédez au portail LinkedIn pour développeurs</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Visitez <a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn Developers</a> et connectez-vous avec votre compte LinkedIn.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Créez une nouvelle application</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Cliquez sur "Create app" et remplissez les informations de base de votre application.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Configurez les autorisations OAuth</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Dans la section "Auth", ajoutez les autorisations: r_liteprofile, r_emailaddress, w_member_social
                  </p>
                </li>
                <li>
                  <span className="font-medium">Ajoutez les URL de redirection OAuth</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Ajoutez l'URL: <code>{window.location.origin}/auth/callback/linkedin</code>
                  </p>
                </li>
                <li>
                  <span className="font-medium">Obtenez vos identifiants</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Dans la section "Auth", vous trouverez votre "Client ID" et "Client Secret".
                  </p>
                </li>
                <li>
                  <span className="font-medium">Vérification de l'application</span>
                  <p className="text-sm text-muted-foreground ml-6 mt-1">
                    Pour une utilisation en production, vous devrez soumettre votre application pour vérification.
                  </p>
                </li>
              </ol>
              
              <div className="pt-4">
                <Button variant="outline" className="flex items-center" asChild>
                  <a href="https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow" target="_blank" rel="noopener noreferrer">
                    Documentation LinkedIn <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wordpress">
          <Card>
            <CardHeader>
              <CardTitle>Connexion à l'API WordPress</CardTitle>
              <CardDescription>
                Comment configurer l'accès à l'API REST de votre site WordPress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Méthodes d'authentification pour WordPress</h3>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">1. Identifiants REST API (Recommandé)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cette méthode utilise l'authentification par mot de passe d'application et est la plus sécurisée.
                  </p>
                  <ol className="list-decimal list-inside mt-2">
                    <li className="text-sm">
                      Accédez à votre tableau de bord WordPress
                    </li>
                    <li className="text-sm">
                      Allez dans "Utilisateurs" puis "Votre profil"
                    </li>
                    <li className="text-sm">
                      Faites défiler jusqu'à la section "Mots de passe d'application"
                    </li>
                    <li className="text-sm">
                      Créez un nouveau mot de passe avec un nom comme "WimbiMaster"
                    </li>
                    <li className="text-sm">
                      Copiez le mot de passe généré (vous ne pourrez plus le voir après)
                    </li>
                  </ol>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">2. Plugin JWT Authentication</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Utilise les tokens JWT pour une authentification plus robuste.
                  </p>
                  <ol className="list-decimal list-inside mt-2">
                    <li className="text-sm">
                      Installez le plugin "JWT Authentication for WP-API"
                    </li>
                    <li className="text-sm">
                      Configurez le plugin selon les instructions
                    </li>
                    <li className="text-sm">
                      Utilisez l'endpoint pour obtenir un token JWT
                    </li>
                  </ol>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">3. Configuration de CORS</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Assurez-vous que votre site WordPress autorise les requêtes depuis WimbiMaster.
                  </p>
                  <p className="text-sm mt-2">
                    Ajoutez ce code à votre fichier functions.php ou utilisez un plugin CORS:
                  </p>
                  <pre className="bg-muted p-2 rounded text-xs mt-2 overflow-x-auto">
                    {`add_action('rest_api_init', function() {
  header('Access-Control-Allow-Origin: ${window.location.origin}');
  header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
  header('Access-Control-Allow-Headers: Authorization, Content-Type');
});`}
                  </pre>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="flex items-center" asChild>
                  <a href="https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/" target="_blank" rel="noopener noreferrer">
                    Documentation WordPress REST API <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiKeysHelp;
