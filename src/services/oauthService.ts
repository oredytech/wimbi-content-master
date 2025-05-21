
import { SocialPlatform } from "@/config/socialConfig";
import { OAuthResult } from "./oauth/types";
import { generateAuthUrl } from "./oauth/authUrlService";
import { getAccessToken, removeAccessToken } from "./oauth/storageService";
import { exchangeCodeForToken } from "./oauth/tokenService";
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
export const initiateOAuthFlow = (platform: SocialPlatform): OAuthResult => {
  try {
    const authUrl = generateAuthUrl(platform);
    
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
