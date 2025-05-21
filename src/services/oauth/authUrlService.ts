
import { socialConfig, SocialPlatform } from "@/config/socialConfig";
import { AuthError } from "./types";
import { generateOAuthState, saveOAuthTemporaryData } from "./storageService";

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
  saveOAuthTemporaryData(`${platform}_oauth_state`, state);
  
  // Construire l'URL selon la plateforme
  switch (platform) {
    case "facebook": {
      const fbConfig = config as typeof socialConfig.facebook;
      const params = new URLSearchParams({
        client_id: fbConfig.appId,
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
      const twitterConfig = config as typeof socialConfig.twitter;
      const codeVerifier = generateOAuthState() + generateOAuthState();
      saveOAuthTemporaryData(`twitter_code_verifier`, codeVerifier);
      
      const params = new URLSearchParams({
        client_id: twitterConfig.clientId,
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
      const linkedinConfig = config as typeof socialConfig.linkedin;
      const params = new URLSearchParams({
        client_id: linkedinConfig.clientId,
        redirect_uri: config.redirectUri,
        state: state,
        response_type: "code",
        scope: config.scopes.join(" ")
      });
      return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    }
    
    case "instagram": {
      // Instagram utilise le même flux OAuth que Facebook
      const fbConfig = socialConfig.facebook;
      const params = new URLSearchParams({
        client_id: fbConfig.appId,
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
