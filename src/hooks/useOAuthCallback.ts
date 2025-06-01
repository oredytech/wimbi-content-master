
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '@/services/oauthService';
import { useToast } from '@/hooks/use-toast';
import { SocialPlatform } from '@/config/socialConfig';
import { getSocialAccount } from '@/services/firebase/socialAccountsService';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useOAuthCallback = (platform?: string) => {
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
        // Vérifier d'abord que l'utilisateur est authentifié
        const currentUser = auth.currentUser;
        if (!currentUser) {
          // Attendre l'état d'authentification
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
              unsubscribe();
              await handleOAuthProcess();
            } else {
              setStatus('error');
              setErrorMessage("Vous devez être connecté pour ajouter des réseaux sociaux");
              setDetailedError("Veuillez vous connecter à votre compte avant de connecter des réseaux sociaux.");
              
              toast({
                title: "Erreur d'authentification",
                description: "Vous devez être connecté pour ajouter des réseaux sociaux",
                variant: "destructive",
              });
              
              // Fermer le popup et informer la fenêtre parent de l'erreur
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'oauth_error', 
                  error: 'Utilisateur non connecté' 
                }, '*');
                window.close();
              } else {
                // Rediriger vers la page de connexion après 2 secondes
                setTimeout(() => {
                  navigate('/login');
                }, 2000);
              }
            }
          });
          
          // Timeout au cas où l'authentification prend trop de temps
          setTimeout(() => {
            unsubscribe();
            if (!auth.currentUser) {
              setStatus('error');
              setErrorMessage("Session expirée");
              setDetailedError("Votre session a expiré. Veuillez vous reconnecter.");
              
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'oauth_error', 
                  error: 'Session expirée' 
                }, '*');
                window.close();
              } else {
                navigate('/login');
              }
            }
          }, 5000);
          
          return;
        }
        
        await handleOAuthProcess();
      } catch (error) {
        console.error('[OAuth] Erreur lors du processus OAuth:', error);
        setStatus('error');
        setErrorMessage("Erreur inattendue");
        setDetailedError("Une erreur inattendue s'est produite. Veuillez réessayer.");
        
        // Informer la fenêtre parent de l'erreur
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'oauth_error', 
            error: 'Erreur inattendue' 
          }, '*');
          window.close();
        }
      }
    };

    const handleOAuthProcess = async () => {
      try {
        // Nettoyer l'URL en supprimant les fragments Facebook (#_=_)
        const cleanUrl = window.location.href.replace(/#_=_$/, '');
        if (cleanUrl !== window.location.href) {
          window.history.replaceState({}, document.title, cleanUrl);
        }

        // Extraire les paramètres de l'URL
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');
        const errorDescription = params.get('error_description') || params.get('error_reason');
        
        // Détermination de la plateforme correcte
        let actualPlatform = platform;
        
        // Détecter la plateforme depuis l'URL si pas dans les paramètres
        if (!actualPlatform || actualPlatform === 'callback') {
          const pathParts = location.pathname.split('/');
          const facebookIndex = pathParts.indexOf('facebook');
          const twitterIndex = pathParts.indexOf('twitter');
          const linkedinIndex = pathParts.indexOf('linkedin');
          const instagramIndex = pathParts.indexOf('instagram');
          
          if (facebookIndex !== -1) actualPlatform = 'facebook';
          else if (twitterIndex !== -1) actualPlatform = 'twitter';
          else if (linkedinIndex !== -1) actualPlatform = 'linkedin';
          else if (instagramIndex !== -1) actualPlatform = 'instagram';
        }
        
        console.log(`[OAuth] Traitement du callback pour ${actualPlatform} avec code: ${code ? 'présent' : 'absent'}, état: ${state ? 'présent' : 'absent'}, erreur: ${error || 'aucune'}`);

        // Vérifier les erreurs renvoyées par le fournisseur OAuth
        if (error) {
          const errorMsg = `Erreur OAuth: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`;
          
          // Informer la fenêtre parent de l'erreur
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'oauth_error', 
              error: errorMsg 
            }, '*');
            window.close();
          }
          
          throw new Error(errorMsg);
        }

        // S'assurer que nous avons un code et un platform valide
        if (!code || !actualPlatform) {
          const errorMsg = "Paramètres OAuth manquants";
          
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'oauth_error', 
              error: errorMsg 
            }, '*');
            window.close();
          }
          
          throw new Error(errorMsg);
        }

        // Vérifier que la plateforme est valide
        const validPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin'];
        if (!validPlatforms.includes(actualPlatform)) {
          const errorMsg = `Plateforme non supportée: ${actualPlatform}`;
          
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'oauth_error', 
              error: errorMsg 
            }, '*');
            window.close();
          }
          
          throw new Error(errorMsg);
        }

        // Vérifier l'état pour prévenir les attaques CSRF
        const storedState = localStorage.getItem(`${actualPlatform}_oauth_state`);
        if (!storedState) {
          console.warn(`[OAuth] État non trouvé pour ${actualPlatform}`);
          const errorMsg = "Session d'authentification expirée ou invalide";
          
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'oauth_error', 
              error: errorMsg 
            }, '*');
            window.close();
          }
          
          throw new Error(errorMsg);
        }
        
        if (state !== storedState) {
          console.error(`[OAuth] État invalide - attendu: ${storedState}, reçu: ${state}`);
          const errorMsg = "État OAuth invalide - possible tentative CSRF";
          
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'oauth_error', 
              error: errorMsg 
            }, '*');
            window.close();
          }
          
          throw new Error(errorMsg);
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
        
        let accountDetails = null;
        if (socialAccount) {
          accountDetails = {
            platform: actualPlatform,
            username: socialAccount.username,
            name: socialAccount.name,
            userInfo: socialAccount.userInfo
          };
          
          if (actualPlatform === 'facebook' && socialAccount.pages) {
            accountDetails.pages = socialAccount.pages;
            accountDetails.pagesCount = socialAccount.pages.length;
          }
          
          setConnectionDetails(accountDetails);
        }

        setStatus('success');
        
        // Informer la fenêtre parent du succès avec les détails du compte
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'oauth_success', 
            platform: actualPlatform,
            account: accountDetails
          }, '*');
          
          // Fermer automatiquement le popup après 1 seconde
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          // Toast de succès si on n'est pas dans un popup
          if (actualPlatform === 'facebook' && accountDetails?.pagesCount > 0) {
            toast({
              title: "Connexion Facebook réussie",
              description: `Votre compte Facebook et ${accountDetails.pagesCount} page(s) ont été connectés avec succès.`,
            });
          } else {
            toast({
              title: "Connexion réussie",
              description: `Votre compte ${actualPlatform} a été connecté avec succès.`,
            });
          }

          // Rediriger automatiquement vers le dashboard après une connexion réussie
          setTimeout(() => {
            navigate("/dashboard/social", { replace: true });
          }, 1500);
        }

      } catch (error) {
        setStatus('error');
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        setErrorMessage(message);
        
        // Fournir des conseils de dépannage basés sur l'erreur
        if (message.includes("État OAuth invalide") || message.includes("Session d'authentification expirée")) {
          setDetailedError("Votre session d'authentification a expiré ou a été interrompue. Veuillez réessayer de vous connecter.");
        } else if (message.includes("access_denied") || message.includes("user_denied")) {
          setDetailedError("Vous avez refusé l'autorisation. Pour connecter votre compte, vous devez accepter les permissions demandées.");
        } else if (message.includes("Utilisateur non connecté")) {
          setDetailedError("Vous devez être connecté à votre compte pour ajouter des réseaux sociaux.");
        } else {
          setDetailedError("Vérifiez que les paramètres de votre application sont correctement configurés dans le tableau de bord développeur.");
        }
        
        console.error(`[OAuth] Erreur lors du traitement du callback pour ${platform}:`, error);
        
        // Informer la fenêtre parent de l'erreur si on est dans un popup
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'oauth_error', 
            error: message 
          }, '*');
          
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          toast({
            title: "Erreur de connexion",
            description: message,
            variant: "destructive",
          });
        }
      }
    };

    processOAuthCallback();
  }, [location, platform, navigate, toast]);

  return {
    status,
    errorMessage,
    detailedError,
    connectionDetails
  };
};
