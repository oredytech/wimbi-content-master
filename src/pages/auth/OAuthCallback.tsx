
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { exchangeCodeForToken } from '@/services/oauthService';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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

        // Vérifier les erreurs renvoyées par le fournisseur OAuth
        if (error) {
          throw new Error(`Erreur OAuth: ${error}`);
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
          throw new Error("État OAuth invalide - possible tentative CSRF");
        }

        // Nettoyer l'état stocké
        localStorage.removeItem(`${platform}_oauth_state`);

        // Échanger le code contre un token (dans une vraie implémentation, ceci se ferait côté serveur)
        const tokenResponse = await exchangeCodeForToken(
          platform as "facebook" | "twitter" | "instagram" | "linkedin", 
          code
        );

        // Simuler l'obtention des informations du compte
        const username = `utilisateur_de_${platform}`;
        
        // Récupérer la couleur correspondant à la plateforme
        let color = "bg-gray-500";
        switch (platform) {
          case 'facebook': color = "bg-blue-600"; break;
          case 'twitter': color = "bg-sky-500"; break;
          case 'instagram': color = "bg-pink-600"; break;
          case 'linkedin': color = "bg-blue-700"; break;
        }

        // Ajouter le compte aux comptes sociaux connectés
        addSocialAccount({
          name: platform.charAt(0).toUpperCase() + platform.slice(1) as any,
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
              <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold">Connexion réussie!</h2>
              <p className="mt-2">Vous allez être redirigé vers votre tableau de bord...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
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
