
import { socialConfig, SocialPlatform, AccessToken } from "@/config/socialConfig";
import { useToast } from "@/hooks/use-toast";

// Classe pour gérer les erreurs d'authentification
export class AuthError extends Error {
  constructor(message: string, public platform: SocialPlatform, public errorCode?: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Génère un état aléatoire pour le flux OAuth
 * @returns {string} État aléatoire
 */
const generateOAuthState = (): string => {
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Enregistre un token d'accès dans un stockage local sécurisé
 * @param {SocialPlatform} platform Plateforme sociale
 * @param {AccessToken} token Token d'accès
 */
export const saveAccessToken = (platform: SocialPlatform, token: AccessToken): void => {
  const tokenData = JSON.stringify({
    ...token,
    savedAt: Date.now(),
  });
  localStorage.setItem(`${platform}_token`, tokenData);
  console.log(`[OAuth] Token enregistré pour ${platform}`);
};

/**
 * Récupère un token d'accès depuis le stockage local
 * @param {SocialPlatform} platform Plateforme sociale
 * @returns {AccessToken|null} Token d'accès ou null s'il n'existe pas ou est expiré
 */
export const getAccessToken = (platform: SocialPlatform): AccessToken | null => {
  const tokenData = localStorage.getItem(`${platform}_token`);
  
  if (!tokenData) {
    return null;
  }
  
  try {
    const token = JSON.parse(tokenData);
    
    // Vérifier si le token est expiré
    if (token.expiresAt && token.expiresAt <= Date.now()) {
      console.log(`[OAuth] Token expiré pour ${platform}`);
      localStorage.removeItem(`${platform}_token`);
      return null;
    }
    
    return token;
  } catch (error) {
    console.error(`[OAuth] Erreur lors de la récupération du token pour ${platform}:`, error);
    localStorage.removeItem(`${platform}_token`);
    return null;
  }
};

/**
 * Supprime un token d'accès du stockage local
 * @param {SocialPlatform} platform Plateforme sociale
 */
export const removeAccessToken = (platform: SocialPlatform): void => {
  localStorage.removeItem(`${platform}_token`);
  localStorage.removeItem(`${platform}_oauth_state`);
  console.log(`[OAuth] Token supprimé pour ${platform}`);
};

/**
 * Génère une URL d'autorisation OAuth pour une plateforme donnée
 * @param {SocialPlatform} platform Plateforme sociale
 * @returns {string} URL d'autorisation
 */
export const generateAuthUrl = (platform: SocialPlatform): string => {
  // Vérifier que la plateforme est supportée
  if (!socialConfig[platform]) {
    throw new AuthError(`Plateforme non supportée: ${platform}`, platform);
  }
  
  const config = socialConfig[platform];
  
  // Générer un état aléatoire pour sécuriser le flux OAuth
  const state = generateOAuthState();
  // Stocker l'état pour vérification lors du callback
  localStorage.setItem(`${platform}_oauth_state`, state);
  
  // Construire l'URL selon la plateforme
  switch (platform) {
    case "facebook": {
      const params = new URLSearchParams({
        client_id: config.appId,
        redirect_uri: config.redirectUri,
        state: state,
        response_type: "code",
        scope: config.scopes.join(",")
      });
      return `https://www.facebook.com/v17.0/dialog/oauth?${params.toString()}`;
    }
    
    case "twitter": {
      // Utiliser OAuth 2.0 avec PKCE pour Twitter
      // Générer le code challenge (normalement avec SHA-256, mais simplifié ici)
      const codeVerifier = generateOAuthState() + generateOAuthState();
      localStorage.setItem(`twitter_code_verifier`, codeVerifier);
      
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        state: state,
        response_type: "code",
        code_challenge: codeVerifier, // Normalement hasher avec SHA-256
        code_challenge_method: "plain", // Ou "S256" si hashé
        scope: config.scopes.join(" ")
      });
      return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    }
    
    case "linkedin": {
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        state: state,
        response_type: "code",
        scope: config.scopes.join(" ")
      });
      return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    }
    
    case "instagram": {
      // Instagram utilise le même flux OAuth que Facebook
      const params = new URLSearchParams({
        client_id: socialConfig.facebook.appId,
        redirect_uri: `${window.location.origin}/auth/callback/instagram`,
        state: state,
        response_type: "code",
        scope: "user_profile,user_media"
      });
      return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
    }
    
    default:
      throw new AuthError(`Plateforme non supportée: ${platform}`, platform as SocialPlatform);
  }
};

/**
 * Initialise le flux d'authentification OAuth
 * @param {SocialPlatform} platform Plateforme sociale
 * @returns {Object} Résultat de l'opération
 */
export const initiateOAuthFlow = (platform: SocialPlatform) => {
  try {
    const authUrl = generateAuthUrl(platform);
    
    // Ouvrir une nouvelle fenêtre pour l'authentification
    const authWindow = window.open(
      authUrl, 
      `${platform}Auth`, 
      "width=600,height=700,left=0,top=0"
    );

    if (!authWindow) {
      throw new AuthError("Impossible d'ouvrir la fenêtre de connexion. Vérifiez les paramètres de votre navigateur.", platform);
    }

    console.log(`[OAuth] Flux d'authentification initialisé pour ${platform}`);
    return { success: true };
  } catch (error) {
    console.error(`[OAuth] Erreur lors de l'initialisation du flux OAuth pour ${platform}:`, error);
    
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : `Erreur lors de la connexion à ${platform}`
    };
  }
};

/**
 * Échange un code d'autorisation contre un token d'accès
 * @param {SocialPlatform} platform Plateforme sociale
 * @param {string} code Code d'autorisation
 * @returns {Promise<Object>} Token d'accès et autres informations
 */
export const exchangeCodeForToken = async (
  platform: SocialPlatform,
  code: string
): Promise<any> => {
  console.log(`[OAuth] Échange de code pour ${platform}...`);
  
  try {
    const config = socialConfig[platform];
    
    // Dans une implémentation réelle, ces requêtes devraient être faites côté serveur pour sécurité
    let tokenResponse;
    
    switch (platform) {
      case "facebook": {
        // Pour Facebook, nous simulons l'échange de code (côté serveur normalement)
        // En réalité, il faut faire une requête POST vers l'API Facebook
        tokenResponse = {
          access_token: `fb_mock_token_${Date.now()}`,
          token_type: "Bearer",
          expires_in: 3600
        };
        break;
      }
      
      case "twitter": {
        // Récupérer le code verifier pour PKCE
        const codeVerifier = localStorage.getItem('twitter_code_verifier') || "";
        
        // Pour Twitter, nous simulons l'échange de code (côté serveur normalement)
        tokenResponse = {
          access_token: `twitter_mock_token_${Date.now()}`,
          token_type: "Bearer",
          expires_in: 7200
        };
        break;
      }
      
      case "linkedin": {
        // Pour LinkedIn, nous simulons l'échange de code (côté serveur normalement)
        tokenResponse = {
          access_token: `linkedin_mock_token_${Date.now()}`,
          token_type: "Bearer",
          expires_in: 7200
        };
        break;
      }
      
      case "instagram": {
        // Pour Instagram, nous simulons l'échange de code (côté serveur normalement)
        tokenResponse = {
          access_token: `instagram_mock_token_${Date.now()}`,
          token_type: "Bearer",
          expires_in: 3600
        };
        break;
      }
      
      default:
        throw new AuthError(`Plateforme non supportée: ${platform}`, platform);
    }
    
    console.log(`[OAuth] Token obtenu pour ${platform}:`, tokenResponse);
    
    // Calculer la date d'expiration
    const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
    
    // Enregistrer le token
    const accessToken: AccessToken = {
      value: tokenResponse.access_token,
      expiresAt,
      tokenType: tokenResponse.token_type,
      refreshToken: tokenResponse.refresh_token
    };
    
    saveAccessToken(platform, accessToken);
    
    return tokenResponse;
  } catch (error) {
    console.error(`[OAuth] Erreur lors de l'échange de code pour ${platform}:`, error);
    throw error;
  } finally {
    // Nettoyage des données temporaires
    localStorage.removeItem(`${platform}_oauth_state`);
    if (platform === "twitter") {
      localStorage.removeItem('twitter_code_verifier');
    }
  }
};

// Service WordPress - Connexion via REST API
export const connectWordPressSite = async (
  url: string,
  username: string,
  password: string
) => {
  try {
    // Vérifier si l'URL inclut le protocole
    const siteUrl = url.startsWith("http") ? url : `https://${url}`;
    
    console.log(`[WordPress] Tentative de connexion à ${siteUrl}/wp-json/...`);
    
    // Simuler une connexion réussie
    // Dans une implémentation réelle, nous ferions une requête à l'API WordPress
    
    const siteInfo = {
      name: new URL(siteUrl).hostname,
      url: siteUrl,
      status: "connected" as const,
      posts: Math.floor(Math.random() * 50),
      userId: "1",
      username: username,
      authMethod: "basic", // Idéalement, utiliser 'jwt' ou 'application_password'
      lastSync: new Date().toISOString()
    };
    
    return { success: true, siteInfo };
  } catch (error) {
    console.error("[WordPress] Erreur de connexion:", error);
    return { 
      success: false, 
      error: error instanceof Error 
        ? error.message 
        : "Erreur lors de la connexion au site WordPress"
    };
  }
};
