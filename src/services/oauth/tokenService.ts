
import { socialConfig, SocialPlatform } from "@/config/socialConfig";
import { AuthError, AccessToken } from "./types";
import { getOAuthTemporaryData, removeOAuthTemporaryData, saveAccessToken } from "./storageService";
import { 
  exchangeFacebookCodeForToken, 
  getFacebookUserInfo, 
  getFacebookPages, 
  saveFacebookData 
} from "./facebookAuthService";

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
    let tokenResponse;
    
    switch (platform) {
      case "facebook": {
        // Traitement spécial pour Facebook avec récupération des pages
        console.log(`[Facebook] Début du processus d'authentification complet`);
        
        // 1. Échanger le code contre un token utilisateur
        const facebookToken = await exchangeFacebookCodeForToken(code);
        
        // 2. Récupérer les informations de l'utilisateur
        const userInfo = await getFacebookUserInfo(facebookToken.access_token);
        
        // 3. Récupérer les pages de l'utilisateur
        const userPages = await getFacebookPages(facebookToken.access_token);
        
        // 4. Sauvegarder toutes les données
        saveFacebookData(userInfo, facebookToken.access_token, userPages);
        
        tokenResponse = {
          access_token: facebookToken.access_token,
          token_type: facebookToken.token_type,
          expires_in: facebookToken.expires_in || 3600,
          user_info: userInfo,
          pages: userPages
        };
        
        console.log(`[Facebook] Processus complet terminé - ${userPages.length} pages connectées`);
        break;
      }
      
      case "twitter": {
        // Récupérer le code verifier pour PKCE
        const codeVerifier = getOAuthTemporaryData('twitter_code_verifier') || "";
        
        tokenResponse = {
          access_token: `twitter_mock_token_${Date.now()}`,
          token_type: "Bearer",
          expires_in: 7200,
          refresh_token: `twitter_refresh_token_${Date.now()}`
        };
        break;
      }
      
      case "linkedin": {
        tokenResponse = {
          access_token: `linkedin_mock_token_${Date.now()}`,
          token_type: "Bearer",
          expires_in: 7200,
          refresh_token: `linkedin_refresh_token_${Date.now()}`
        };
        break;
      }
      
      case "instagram": {
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
    removeOAuthTemporaryData(`${platform}_oauth_state`);
    if (platform === "twitter") {
      removeOAuthTemporaryData('twitter_code_verifier');
    }
  }
};

/**
 * Rafraîchit un token d'accès expiré en utilisant un refresh token
 * @param {SocialPlatform} platform Plateforme sociale
 * @param {string} refreshToken Token de rafraîchissement
 * @returns {Promise<Object>} Nouveau token d'accès et information
 */
export const refreshAccessToken = async (
  platform: SocialPlatform,
  refreshToken: string
): Promise<AccessToken> => {
  console.log(`[OAuth] Rafraîchissement du token pour ${platform}...`);
  
  try {
    // Simuler une requête de rafraîchissement de token
    // Dans une implémentation réelle, cela serait fait côté serveur
    
    const tokenResponse = {
      access_token: `${platform}_refreshed_token_${Date.now()}`,
      token_type: "Bearer",
      expires_in: platform === "facebook" ? 3600 : 7200,
      refresh_token: refreshToken // Certaines plateformes renvoient un nouveau refresh_token
    };
    
    // Calculer la nouvelle date d'expiration
    const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
    
    // Créer le nouvel objet AccessToken
    const accessToken: AccessToken = {
      value: tokenResponse.access_token,
      expiresAt,
      tokenType: tokenResponse.token_type,
      refreshToken: tokenResponse.refresh_token
    };
    
    // Sauvegarder le nouveau token
    saveAccessToken(platform, accessToken);
    
    return accessToken;
  } catch (error) {
    console.error(`[OAuth] Erreur lors du rafraîchissement du token pour ${platform}:`, error);
    throw error;
  }
};
