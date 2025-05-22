
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { exchangeCodeForToken } from '@/services/oauthService';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Settings, RefreshCw } from 'lucide-react';
import { SocialPlatform } from '@/config/socialConfig';
import { Link } from 'react-router-dom';

const OAuthCallback = () => {
  const { platform } = useParams<{ platform: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addSocialAccount } = useAppContext();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState("");
  const [detailedError, setDetailedError] = useState("");

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Extraire les paramètres de l'URL
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');
        const errorDescription = params.get('error_description') || params.get('error_reason');
        
        // Détermination de la plateforme correcte (extraire de la route)
        let actualPlatform = platform;
        
        // Gestion des différents formats de routes
        if (actualPlatform === 'callback') {
          // Format /auth/callback/:platform
          actualPlatform = location.pathname.split('/').pop();
        } else if (location.pathname.includes(`/auth/${actualPlatform}/callback`)) {
          // Format /auth/:platform/callback
          // actualPlatform est déjà correct
        }
        
        console.log(`[OAuth] Traitement du callback pour ${actualPlatform} avec code: ${code ? 'présent' : 'absent'}, état: ${state ? 'présent' : 'absent'}, erreur: ${error || 'aucune'}`);

        // Vérifier les erreurs renvoyées par le fournisseur OAuth
        if (error) {
          throw new Error(`Erreur OAuth: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`);
        }

        // S'assurer que nous avons un code et un platform valide
        if (!code || !actualPlatform) {
          throw new Error("Paramètres OAuth manquants");
        }

        // Vérifier que la plateforme est valide
        const validPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin'];
        if (!validPlatforms.includes(actualPlatform)) {
          throw new Error(`Plateforme non supportée: ${actualPlatform}`);
        }

        // Vérifier l'état pour prévenir les attaques CSRF
        const storedState = localStorage.getItem(`${actualPlatform}_oauth_state`);
        if (!storedState) {
          console.warn(`[OAuth] État non trouvé pour ${actualPlatform}`);
          throw new Error("Session d'authentification expirée ou invalide");
        }
        
        if (state !== storedState) {
          console.error(`[OAuth] État invalide - attendu: ${storedState}, reçu: ${state}`);
          throw new Error("État OAuth invalide - possible tentative CSRF");
        }

        // Nettoyer l'état stocké
        localStorage.removeItem(`${actualPlatform}_oauth_state`);

        // Échanger le code contre un token
        const tokenResponse = await exchangeCodeForToken(
          actualPlatform as SocialPlatform, 
          code
        );

        console.log(`[OAuth] Token obtenu pour ${actualPlatform}`);

        // Récupérer la couleur correspondant à la plateforme
        let color = "bg-gray-500";
        let name = actualPlatform.charAt(0).toUpperCase() + actualPlatform.slice(1);
        let username = `utilisateur_de_${actualPlatform}`;

        switch (actualPlatform) {
          case 'facebook': 
            color = "bg-blue-600"; 
            name = "Facebook";
            // Normalement, récupérer les infos de l'utilisateur via l'API
            break;
          case 'twitter': 
            color = "bg-sky-500";
            name = "Twitter";
            // Normalement, récupérer les infos de l'utilisateur via l'API
            break;
          case 'instagram': 
            color = "bg-pink-600";
            name = "Instagram";
            // Normalement, récupérer les infos de l'utilisateur via l'API
            break;
          case 'linkedin': 
            color = "bg-blue-700";
            name = "LinkedIn";
            // Normalement, récupérer les infos de l'utilisateur via l'API
            break;
        }

        // Ajouter le compte aux comptes sociaux connectés
        addSocialAccount({
          name: name as any,
          username,
          connected: true,
          icon: actualPlatform,
          color,
        });

        setStatus('success');
        toast({
          title: "Connexion réussie",
          description: `Votre compte ${name} a été connecté avec succès.`,
        });

        // Rediriger vers la page des réseaux sociaux après un court délai
        setTimeout(() => {
          navigate("/dashboard/social");
        }, 2000);

      } catch (error) {
        setStatus('error');
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        setErrorMessage(message);
        
        // Fournir des conseils de dépannage basés sur l'erreur
        if (message.includes("État OAuth invalide") || message.includes("Session d'authentification expirée")) {
          setDetailedError("Votre session d'authentification a expiré ou a été interrompue. Veuillez réessayer de vous connecter.");
        } else if (message.includes("access_denied") || message.includes("user_denied")) {
          setDetailedError("Vous avez refusé l'autorisation. Pour connecter votre compte, vous devez accepter les permissions demandées.");
        } else {
          setDetailedError("Vérifiez que les paramètres de votre application sont correctement configurés dans le tableau de bord développeur.");
        }
        
        console.error(`[OAuth] Erreur lors du traitement du callback pour ${platform}:`, error);
        
        toast({
          title: "Erreur de connexion",
          description: message,
          variant: "destructive",
        });
      }
    };

    processOAuthCallback();
  }, [location, platform, navigate, addSocialAccount, toast]);

  const handleRetry = () => {
    navigate('/dashboard/social');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
              <h2 className="mt-4 text-xl font-semibold">Connexion en cours</h2>
              <p className="mt-2">Nous finalisons la connexion à votre compte social...</p>
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
              {detailedError && <p className="mt-2">{detailedError}</p>}
            </>
          )}
        </CardContent>
        
        {status === 'error' && (
          <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
            <Button variant="outline" onClick={handleRetry} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
            <Button asChild>
              <Link to="/dashboard/api-keys-config" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Vérifier la configuration
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default OAuthCallback;
