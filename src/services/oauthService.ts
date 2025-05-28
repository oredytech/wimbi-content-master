
import { SocialPlatform } from "@/config/socialConfig";
import { OAuthResult } from "./oauth/types";
import { generateAuthUrl } from "./oauth/authUrlService";
import { getAccessToken, removeAccessToken } from "./oauth/storageService";
import { exchangeCodeForToken, refreshAccessToken } from "./oauth/tokenService";
import { connectWordPressSite as connectWordPressSiteInternal } from "./oauth/wordpressService";

// Réexporter les fonctions et types importants
export { getAccessToken, removeAccessToken, exchangeCodeForToken };
export type { AuthError, AccessToken } from "./oauth/types";
export { connectWordPressSite } from "./oauth/wordpressService";

/**
 * Initialise le flux d'authentification OAuth
 * @param {SocialPlatform} platform Plateforme sociale
 * @returns {Object} Résultat de l'opération
 */
export const initiateOAuthFlow = async (platform: SocialPlatform): Promise<OAuthResult> => {
  try {
    const authUrl = await generateAuthUrl(platform);
    
    // Ouvrir une nouvelle fenêtre pour l'authentification
    const authWindow = window.open(
      authUrl, 
      `${platform}Auth`, 
      "width=600,height=700,left=0,top=0"
    );

    if (!authWindow) {
      throw new Error("Impossible d'ouvrir la fenêtre de connexion. Vérifiez les paramètres de votre navigateur.");
    }

    console.log(`[OAuth] Flux d'authentification initialisé pour ${platform}`);
    return { success: true };
  } catch (error) {
    console.error(`[OAuth] Erreur lors de l'initialisation du flux OAuth pour ${platform}:`, error);
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : `Erreur lors de la connexion à ${platform}`
    };
  }
};

/**
 * Vérifie si le token d'accès est expiré et le rafraîchit si nécessaire
 * @param {SocialPlatform} platform Plateforme sociale
 * @returns {Promise<string|null>} Token d'accès valide ou null
 */
export const getValidAccessToken = async (platform: SocialPlatform): Promise<string|null> => {
  const token = getAccessToken(platform);
  
  if (!token) {
    return null;
  }
  
  // Vérifier si le token est expiré
  const now = Date.now();
  const isExpired = token.expiresAt <= now;
  
  // Si le token est valide, le renvoyer directement
  if (!isExpired) {
    return token.value;
  }
  
  // Si le token est expiré et qu'un refresh_token est disponible
  if (token.refreshToken) {
    try {
      const newToken = await refreshAccessToken(platform, token.refreshToken);
      return newToken.value;
    } catch (error) {
      console.error(`[OAuth] Échec du rafraîchissement du token pour ${platform}`, error);
      return null;
    }
  }
  
  // Si le token est expiré et qu'il n'y a pas de refresh_token
  return null;
};
