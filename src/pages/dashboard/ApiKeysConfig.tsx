
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertTriangle } from 'lucide-react';
import { socialConfig } from '@/config/socialConfig';

const ApiKeysConfig = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration des API Réseaux Sociaux</h1>
        <p className="text-muted-foreground mt-2">
          Guide détaillé pour configurer vos applications dans les tableaux de bord développeur des réseaux sociaux.
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription>
          Pour connecter vos réseaux sociaux, vous devez d'abord configurer des applications développeur sur chaque plateforme.
          Ce guide vous explique comment procéder étape par étape.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="facebook" className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-fit">
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
        </TabsList>

        <TabsContent value="facebook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Facebook</CardTitle>
              <CardDescription>
                Configurer une application Facebook pour se connecter à WimbiMaster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Étapes à suivre</h3>
              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li>
                  <span className="font-medium">Accédez au <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Developer Portal</a></span>
                  <p className="text-muted-foreground ml-6 mt-1">Connectez-vous avec votre compte Facebook</p>
                </li>
                <li>
                  <span className="font-medium">Créez une nouvelle application</span>
                  <p className="text-muted-foreground ml-6 mt-1">Sélectionnez "Entreprise" ou "Grand Public" selon votre cas d'usage</p>
                </li>
                <li>
                  <span className="font-medium">Dans les paramètres de base, notez votre App ID et App Secret</span>
                  <p className="text-muted-foreground ml-6 mt-1">Ces informations sont nécessaires pour la configuration de WimbiMaster</p>
                </li>
                <li>
                  <span className="font-medium">Ajoutez le produit "Facebook Login" à votre application</span>
                  <ul className="list-disc list-inside ml-6">
                    <li>Dans les paramètres OAuth, ajoutez l'URL de redirection suivante :
                      <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">{window.location.origin}/auth/callback/facebook</pre>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Ajoutez le produit "Pages" si vous souhaitez gérer vos Pages Facebook</span>
                </li>
                <li>
                  <span className="font-medium">Configurez les permissions requises</span>
                  <ul className="list-disc list-inside ml-6">
                    <li>pages_show_list</li>
                    <li>pages_read_engagement</li>
                    <li>pages_manage_posts</li>
                    <li>pages_manage_metadata</li>
                    <li>public_profile</li>
                    <li>email</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Mettez à jour la configuration dans WimbiMaster</span>
                  <p className="text-muted-foreground ml-6 mt-1">Remplacez les identifiants par défaut par les vôtres dans les paramètres</p>
                </li>
              </ol>

              <div className="border rounded-md p-4 bg-gray-50 mt-6">
                <h4 className="font-semibold">Configuration actuelle</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-sm font-medium">App ID:</div>
                  <div className="text-sm">{socialConfig.facebook.appId || "Non configuré"}</div>
                  <div className="text-sm font-medium">URL de redirection:</div>
                  <div className="text-sm">{socialConfig.facebook.redirectUri}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="twitter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Twitter/X</CardTitle>
              <CardDescription>
                Configurer une application Twitter pour se connecter à WimbiMaster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Étapes à suivre</h3>
              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li>
                  <span className="font-medium">Accédez au <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Twitter Developer Portal</a></span>
                </li>
                <li>
                  <span className="font-medium">Créez un projet et une application</span>
                </li>
                <li>
                  <span className="font-medium">Dans les paramètres de l'application, notez votre Client ID et Client Secret</span>
                </li>
                <li>
                  <span className="font-medium">Configurez l'authentification OAuth 2.0</span>
                  <ul className="list-disc list-inside ml-6">
                    <li>Type : Application Web</li>
                    <li>URL de callback : 
                      <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">{window.location.origin}/auth/callback/twitter</pre>
                    </li>
                    <li>Site web : Votre URL</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Demandez les permissions suivantes</span>
                  <ul className="list-disc list-inside ml-6">
                    <li>tweet.read</li>
                    <li>tweet.write</li>
                    <li>users.read</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Pour un compte développeur Basic, remplissez la description détaillée de votre cas d'usage</span>
                </li>
              </ol>
              
              <div className="border rounded-md p-4 bg-gray-50 mt-6">
                <h4 className="font-semibold">Configuration actuelle</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-sm font-medium">Client ID:</div>
                  <div className="text-sm">{socialConfig.twitter.clientId || "Non configuré"}</div>
                  <div className="text-sm font-medium">URL de redirection:</div>
                  <div className="text-sm">{socialConfig.twitter.redirectUri}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linkedin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration LinkedIn</CardTitle>
              <CardDescription>
                Configurer une application LinkedIn pour se connecter à WimbiMaster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Étapes à suivre</h3>
              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li>
                  <span className="font-medium">Accédez au <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn Developer Portal</a></span>
                </li>
                <li>
                  <span className="font-medium">Créez une nouvelle application</span>
                </li>
                <li>
                  <span className="font-medium">Configurez l'authentification OAuth 2.0</span>
                  <ul className="list-disc list-inside ml-6">
                    <li>URL de redirection autorisées : 
                      <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">{window.location.origin}/auth/callback/linkedin</pre>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Demandez les permissions suivantes</span>
                  <ul className="list-disc list-inside ml-6">
                    <li>r_liteprofile</li>
                    <li>r_emailaddress</li>
                    <li>w_member_social</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Notez votre Client ID et Client Secret</span>
                </li>
              </ol>
              
              <div className="border rounded-md p-4 bg-gray-50 mt-6">
                <h4 className="font-semibold">Configuration actuelle</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-sm font-medium">Client ID:</div>
                  <div className="text-sm">{socialConfig.linkedin.clientId || "Non configuré"}</div>
                  <div className="text-sm font-medium">URL de redirection:</div>
                  <div className="text-sm">{socialConfig.linkedin.redirectUri}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instagram" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Instagram</CardTitle>
              <CardDescription>
                Configurer une application Instagram pour se connecter à WimbiMaster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Étapes à suivre</h3>
              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li>
                  <span className="font-medium">Accédez au <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Developer Portal</a> (Instagram utilise la même plateforme)</span>
                </li>
                <li>
                  <span className="font-medium">Créez une nouvelle application si ce n'est pas déjà fait</span>
                </li>
                <li>
                  <span className="font-medium">Ajoutez le produit "Instagram Basic Display" à votre application</span>
                </li>
                <li>
                  <span className="font-medium">Dans les paramètres de l'application Instagram</span>
                  <ul className="list-disc list-inside ml-6">
                    <li>Ajoutez l'URL de redirection : 
                      <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">{window.location.origin}/auth/callback/instagram</pre>
                    </li>
                    <li>Ajoutez l'URL de déconnexion : votre URL d'accueil</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">Demandez les permissions suivantes</span>
                  <ul className="list-disc list-inside ml-6">
                    <li>instagram_basic</li>
                    <li>instagram_content_publish</li>
                    <li>pages_show_list</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">IMPORTANT : Pour la publication sur Instagram</span>
                  <p className="text-muted-foreground ml-6 mt-1">Vous devez avoir un compte Instagram Business connecté à une Page Facebook</p>
                </li>
              </ol>
              
              <div className="border rounded-md p-4 bg-gray-50 mt-6">
                <h4 className="font-semibold">Configuration actuelle</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-sm font-medium">App ID:</div>
                  <div className="text-sm">{socialConfig.instagram.appId || "Non configuré"}</div>
                  <div className="text-sm font-medium">URL de redirection:</div>
                  <div className="text-sm">{socialConfig.instagram.redirectUri}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Configuration des paramètres dans WimbiMaster</CardTitle>
          <CardDescription>
            Comment mettre à jour vos clés API dans l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">Options de configuration</h3>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-semibold">Option 1 : Variables d'environnement (recommandé)</h4>
              <p className="text-sm text-muted-foreground mt-1">Créez un fichier <code>.env.local</code> à la racine du projet avec les variables suivantes :</p>
              <pre className="bg-gray-100 p-3 rounded mt-2 text-sm overflow-auto">
{`VITE_FACEBOOK_APP_ID=votre_facebook_app_id
VITE_FACEBOOK_API_KEY=votre_facebook_api_key
VITE_TWITTER_CLIENT_ID=votre_twitter_client_id
VITE_TWITTER_CLIENT_SECRET=votre_twitter_client_secret
VITE_TWITTER_BEARER_TOKEN=votre_twitter_bearer_token
VITE_LINKEDIN_CLIENT_ID=votre_linkedin_client_id
VITE_LINKEDIN_CLIENT_SECRET=votre_linkedin_client_secret`}
              </pre>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-semibold">Option 2 : Mise à jour directe du fichier de configuration</h4>
              <p className="text-sm text-muted-foreground mt-1">Modifiez le fichier <code>src/config/socialConfig.ts</code> pour y placer vos clés.</p>
              <p className="text-xs text-red-600 mt-1">Note: Cette option n'est pas recommandée pour la production car elle expose vos clés dans le code source.</p>
            </div>
          </div>
          
          <Alert className="mt-6">
            <Check className="h-4 w-4 text-green-500" />
            <AlertDescription>
              Une fois configuré, retournez à la <Link to="/dashboard/social" className="text-blue-600 hover:underline">page des réseaux sociaux</Link> pour connecter vos comptes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeysConfig;
