
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { exchangeCodeForToken } from '@/services/oauthService';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { SocialPlatform } from '@/config/socialConfig';

const OAuthCallback = () => {
  const { platform } = useParams<{ platform: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addSocialAccount } = useAppContext();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Extraire les paramètres de l'URL
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        
        console.log(`[OAuth] Traitement du callback pour ${platform} avec code: ${code && 'présent'}, état: ${state && 'présent'}, erreur: ${error || 'aucune'}`);

        // Vérifier les erreurs renvoyées par le fournisseur OAuth
        if (error) {
          throw new Error(`Erreur OAuth: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`);
        }

        // S'assurer que nous avons un code et un platform valide
        if (!code || !platform) {
          throw new Error("Paramètres OAuth manquants");
        }

        // Vérifier que la plateforme est valide
        const validPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin'];
        if (!validPlatforms.includes(platform)) {
          throw new Error(`Plateforme non supportée: ${platform}`);
        }

        // Vérifier l'état pour prévenir les attaques CSRF
        const storedState = localStorage.getItem(`${platform}_oauth_state`);
        if (state !== storedState) {
          console.error(`[OAuth] État invalide - attendu: ${storedState}, reçu: ${state}`);
          throw new Error("État OAuth invalide - possible tentative CSRF");
        }

        // Nettoyer l'état stocké
        localStorage.removeItem(`${platform}_oauth_state`);

        // Échanger le code contre un token
        const tokenResponse = await exchangeCodeForToken(
          platform as SocialPlatform, 
          code
        );

        console.log(`[OAuth] Token obtenu pour ${platform}:`, tokenResponse);

        // Récupérer la couleur correspondant à la plateforme
        let color = "bg-gray-500";
        let name = platform.charAt(0).toUpperCase() + platform.slice(1);
        let username = `utilisateur_de_${platform}`;

        switch (platform) {
          case 'facebook': 
            color = "bg-blue-600"; 
            // Normalement, récupérer les infos de l'utilisateur via l'API
            // const userInfo = await fetch(`https://graph.facebook.com/me?fields=name,email&access_token=${tokenResponse.access_token}`);
            // username = userInfo.name;
            break;
          case 'twitter': 
            color = "bg-sky-500";
            // Normalement, récupérer les infos de l'utilisateur via l'API
            break;
          case 'instagram': 
            color = "bg-pink-600";
            // Normalement, récupérer les infos de l'utilisateur via l'API
            break;
          case 'linkedin': 
            color = "bg-blue-700";
            // Normalement, récupérer les infos de l'utilisateur via l'API
            break;
        }

        // Ajouter le compte aux comptes sociaux connectés
        addSocialAccount({
          name: name as any,
          username,
          connected: true,
          icon: platform,
          color,
        });

        setStatus('success');
        toast({
          title: "Connexion réussie",
          description: `Votre compte ${platform} a été connecté avec succès.`,
        });

        // Rediriger vers la page des réseaux sociaux après un court délai
        setTimeout(() => {
          navigate("/dashboard/social");
        }, 2000);

      } catch (error) {
        setStatus('error');
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        setErrorMessage(message);
        
        console.error(`[OAuth] Erreur lors du traitement du callback pour ${platform}:`, error);
        
        toast({
          title: "Erreur de connexion",
          description: message,
          variant: "destructive",
        });

        // Rediriger vers la page des réseaux sociaux après un court délai même en cas d'erreur
        setTimeout(() => {
          navigate("/dashboard/social");
        }, 3000);
      }
    };

    processOAuthCallback();
  }, [location, platform, navigate, addSocialAccount, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
              <h2 className="mt-4 text-xl font-semibold">Connexion en cours</h2>
              <p className="mt-2">Nous finalisons la connexion à votre compte {platform}...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
              <h2 className="mt-4 text-xl font-semibold">Connexion réussie!</h2>
              <p className="mt-2">Vous allez être redirigé vers votre tableau de bord...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="h-8 w-8 mx-auto text-red-600" />
              <h2 className="mt-4 text-xl font-semibold">Erreur de connexion</h2>
              <p className="mt-2 text-red-600">{errorMessage}</p>
              <p className="mt-1">Vous allez être redirigé vers votre tableau de bord...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
