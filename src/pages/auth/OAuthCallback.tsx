import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { exchangeCodeForToken } from '@/services/oauthService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Settings, RefreshCw, Users } from 'lucide-react';
import { SocialPlatform } from '@/config/socialConfig';
import { Link } from 'react-router-dom';
import { getSocialAccount } from '@/services/firebase/socialAccountsService';

const OAuthCallback = () => {
  const { platform } = useParams<{ platform: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState("");
  const [detailedError, setDetailedError] = useState("");
  const [connectionDetails, setConnectionDetails] = useState<any>(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Extraire les paramètres de l'URL
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');
        const errorDescription = params.get('error_description') || params.get('error_reason');
        
        // Détermination de la plateforme correcte
        let actualPlatform = platform;
        
        if (actualPlatform === 'callback') {
          actualPlatform = location.pathname.split('/').pop();
        } else if (location.pathname.includes(`/auth/${actualPlatform}/callback`)) {
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

        // Échanger le code contre un token et sauvegarder dans Firebase
        const tokenResponse = await exchangeCodeForToken(
          actualPlatform as SocialPlatform, 
          code
        );

        console.log(`[OAuth] Token obtenu et sauvegardé dans Firebase pour ${actualPlatform}`);

        // Récupérer les données du compte depuis Firebase
        const socialAccount = await getSocialAccount(actualPlatform as SocialPlatform);
        
        if (socialAccount) {
          if (actualPlatform === 'facebook' && socialAccount.pages) {
            setConnectionDetails({
              userInfo: socialAccount.userInfo,
              pages: socialAccount.pages,
              pagesCount: socialAccount.pages.length
            });
          }
        }

        setStatus('success');
        
        // Toast de succès personnalisé selon la plateforme
        if (actualPlatform === 'facebook' && connectionDetails?.pagesCount > 0) {
          toast({
            title: "Connexion Facebook réussie",
            description: `Votre compte Facebook et ${connectionDetails.pagesCount} page(s) ont été connectés avec succès.`,
          });
        } else {
          toast({
            title: "Connexion réussie",
            description: `Votre compte ${actualPlatform} a été connecté avec succès.`,
          });
        }

        // Rediriger vers la page des réseaux sociaux après un court délai
        setTimeout(() => {
          navigate("/dashboard/social?connected=" + actualPlatform);
        }, 2500);

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
  }, [location, platform, navigate, toast]);

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
              <p className="mt-2">Nous finalisons la connexion et sauvegardons vos données...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
              <h2 className="mt-4 text-xl font-semibold">Connexion réussie!</h2>
              <p className="mt-2">Vos données ont été sauvegardées de manière sécurisée.</p>
              
              {connectionDetails && connectionDetails.pagesCount > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {connectionDetails.pagesCount} page(s) Facebook connectée(s)
                    </span>
                  </div>
                </div>
              )}
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
              <Link to="/dashboard/social" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Retour au tableau de bord
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default OAuthCallback;
