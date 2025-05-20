
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, CopyCheck, Copy, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApiKeysHelp = () => {
  const { toast } = useToast();

  const handleCopyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `L'URL de redirection pour ${platform} a été copiée dans le presse-papier.`,
    });
  };

  // URL de base du site pour les redirections OAuth
  const baseUrl = window.location.origin;

  // URLs de redirection OAuth
  const redirectUrls = {
    facebook: `${baseUrl}/auth/callback/facebook`,
    twitter: `${baseUrl}/auth/callback/twitter`,
    linkedin: `${baseUrl}/auth/callback/linkedin`,
    wordpress: `${baseUrl}/auth/callback/wordpress`,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration des API</h1>
        <p className="text-muted-foreground">
          Guide pour configurer les connexions aux réseaux sociaux et à WordPress.
        </p>
      </div>

      <Tabs defaultValue="facebook" className="space-y-4">
        <TabsList>
          <TabsTrigger value="facebook" className="flex items-center">
            <Facebook className="mr-2 h-4 w-4" /> Facebook
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center">
            <Twitter className="mr-2 h-4 w-4" /> Twitter/X
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="flex items-center">
            <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
          </TabsTrigger>
          <TabsTrigger value="wordpress" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" /> WordPress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="facebook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'API Facebook</CardTitle>
              <CardDescription>
                Configurez votre application Facebook pour permettre la connexion OAuth.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Créez une application sur Facebook Developers</h3>
                <p className="text-sm text-muted-foreground">
                  Rendez-vous sur <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">developers.facebook.com</a> et créez une nouvelle application.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">2. Configurez les paramètres OAuth</h3>
                <p className="text-sm text-muted-foreground">
                  Dans les paramètres de votre application Facebook, allez dans "Facebook Login" {'>'} "Settings" et ajoutez l'URL de redirection suivante :
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={redirectUrls.facebook} readOnly className="bg-muted" />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleCopyToClipboard(redirectUrls.facebook, "Facebook")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">3. Configurez les autorisations</h3>
                <p className="text-sm text-muted-foreground">
                  Assurez-vous que votre application demande les autorisations suivantes :
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>pages_show_list</li>
                  <li>pages_read_engagement</li>
                  <li>pages_manage_posts</li>
                  <li>pages_manage_metadata</li>
                  <li>public_profile</li>
                  <li>email</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">4. Récupérez vos identifiants</h3>
                <p className="text-sm text-muted-foreground">
                  Dans les paramètres de base de votre application, notez votre ID d'application et votre clé secrète. Ajoutez ces informations dans les paramètres de Wimbi Master.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="twitter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'API Twitter/X</CardTitle>
              <CardDescription>
                Configurez votre application Twitter pour permettre la connexion OAuth.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Créez une application sur Twitter Developer Portal</h3>
                <p className="text-sm text-muted-foreground">
                  Rendez-vous sur <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">developer.twitter.com</a> et créez une nouvelle application.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">2. Configurez les paramètres OAuth</h3>
                <p className="text-sm text-muted-foreground">
                  Dans les paramètres de votre application Twitter, ajoutez l'URL de redirection suivante dans "Authentication settings" {'>'} "Callback URLs":
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={redirectUrls.twitter} readOnly className="bg-muted" />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleCopyToClipboard(redirectUrls.twitter, "Twitter")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">3. Configurez les autorisations</h3>
                <p className="text-sm text-muted-foreground">
                  Définissez les autorisations de lecture et d'écriture pour votre application.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>tweet.read</li>
                  <li>tweet.write</li>
                  <li>users.read</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">4. Récupérez vos identifiants</h3>
                <p className="text-sm text-muted-foreground">
                  Dans les paramètres de votre application, notez votre API Key, API Key Secret et Bearer Token. Ajoutez ces informations dans les paramètres de Wimbi Master.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linkedin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'API LinkedIn</CardTitle>
              <CardDescription>
                Configurez votre application LinkedIn pour permettre la connexion OAuth.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Créez une application sur LinkedIn Developers</h3>
                <p className="text-sm text-muted-foreground">
                  Rendez-vous sur <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">linkedin.com/developers/apps</a> et créez une nouvelle application.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">2. Configurez les paramètres OAuth</h3>
                <p className="text-sm text-muted-foreground">
                  Dans les paramètres de votre application LinkedIn, allez dans "Auth" et ajoutez l'URL de redirection suivante :
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={redirectUrls.linkedin} readOnly className="bg-muted" />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleCopyToClipboard(redirectUrls.linkedin, "LinkedIn")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">3. Configurez les autorisations</h3>
                <p className="text-sm text-muted-foreground">
                  Ajoutez les scopes suivants à votre application :
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>r_liteprofile</li>
                  <li>r_emailaddress</li>
                  <li>w_member_social</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">4. Récupérez vos identifiants</h3>
                <p className="text-sm text-muted-foreground">
                  Dans les paramètres de votre application, notez votre Client ID et Client Secret. Ajoutez ces informations dans les paramètres de Wimbi Master.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wordpress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de WordPress</CardTitle>
              <CardDescription>
                Configurez votre site WordPress pour permettre la connexion via l'API REST.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Installez le plugin JWT Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Pour une sécurité optimale, nous recommandons d'utiliser l'authentification JWT pour WordPress. Installez un plugin comme "JWT Authentication for WP REST API" sur votre site WordPress.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">2. Créez un utilisateur Application Password</h3>
                <p className="text-sm text-muted-foreground">
                  Depuis WordPress 5.6, vous pouvez créer des mots de passe d'application. Dans votre profil WordPress, allez à la section "Application Passwords", créez un nouveau mot de passe spécifique pour Wimbi Master.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">3. Activez CORS sur votre site WordPress</h3>
                <p className="text-sm text-muted-foreground">
                  Pour permettre les requêtes depuis Wimbi Master, vous devrez peut-être configurer CORS sur votre site WordPress. Ajoutez le code suivant à votre fichier functions.php ou utilisez un plugin comme "WP CORS":
                </p>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                  {`add_action('init', function() {
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
  header("Access-Control-Allow-Headers: Authorization, Content-Type");
  if ('OPTIONS' == $_SERVER['REQUEST_METHOD']) {
    status_header(200);
    exit();
  }
});`}
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">4. Testez la connexion</h3>
                <p className="text-sm text-muted-foreground">
                  Une fois configuré, utilisez les informations dans Wimbi Master pour connecter votre site WordPress.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiKeysHelp;
