
import { socialConfig, SocialPlatform } from "@/config/socialConfig";
import { twitterConfig } from "@/config/twitterConfig";
import { AuthError } from "./types";
import { generateOAuthState, saveOAuthTemporaryData } from "./storageService";
import { generateCodeVerifier, generateCodeChallenge } from "./twitter/twitterPKCE";

/**
 * Génère une URL d'autorisation OAuth pour une plateforme donnée
 * @param {SocialPlatform} platform Plateforme sociale
 * @returns {string} URL d'autorisation
 */
export const generateAuthUrl = async (platform: SocialPlatform): Promise<string> => {
  // Vérifier que la plateforme est supportée
  if (!socialConfig[platform] && platform !== "twitter") {
    throw new AuthError(`Plateforme non supportée: ${platform}`, platform);
  }
  
  // Générer un état aléatoire pour sécuriser le flux OAuth
  const state = generateOAuthState();
  // Stocker l'état pour vérification lors du callback
  saveOAuthTemporaryData(`${platform}_oauth_state`, state);
  
  // Construire l'URL selon la plateforme
  switch (platform) {
    case "facebook": {
      const config = socialConfig[platform];
      const fbConfig = config as typeof socialConfig.facebook;
      const params = new URLSearchParams({
        client_id: fbConfig.appId,
        redirect_uri: config.redirectUri,
        scope: "email,public_profile,pages_manage_posts,pages_read_engagement,pages_show_list",
        response_type: "code",
        state: state
      });
      return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
    }
    
    case "twitter": {
      // Utiliser OAuth 2.0 avec PKCE pour Twitter
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      // Sauvegarder le code verifier pour l'échange de token
      saveOAuthTemporaryData('twitter_code_verifier', codeVerifier);
      
      const params = new URLSearchParams({
        client_id: twitterConfig.clientId,
        redirect_uri: twitterConfig.redirectUri,
        state: state,
        response_type: "code",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        scope: twitterConfig.scopes.join(" ")
      });
      return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    }
    
    case "linkedin": {
      const config = socialConfig[platform];
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
      const config = socialConfig[platform];
      const igConfig = config as typeof socialConfig.instagram;
      const params = new URLSearchParams({
        client_id: igConfig.appId,
        redirect_uri: config.redirectUri,
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
