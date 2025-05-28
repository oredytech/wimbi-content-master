
import { twitterConfig } from "@/config/twitterConfig";
import { AuthError } from "../types";
import { saveSocialAccountToFirebase } from "@/services/firebase/socialAccountsService";

/**
 * Interface pour la réponse de token Twitter
 */
export interface TwitterTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

/**
 * Interface pour les données utilisateur Twitter
 */
export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

/**
 * Échange le code d'autorisation contre un access token
 */
export const exchangeTwitterCodeForToken = async (code: string, codeVerifier: string): Promise<TwitterTokenResponse> => {
  console.log(`[Twitter] Échange du code d'autorisation...`);
  
  try {
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${twitterConfig.clientId}:${twitterConfig.clientSecret}`)}`
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: twitterConfig.redirectUri,
        code_verifier: codeVerifier
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur Twitter API: ${errorData.error_description || response.statusText}`);
    }

    const tokenData: TwitterTokenResponse = await response.json();
    console.log(`[Twitter] Token obtenu avec succès`);
    return tokenData;
    
  } catch (error) {
    console.error(`[Twitter] Erreur lors de l'échange du code:`, error);
    throw new AuthError("Impossible d'obtenir le token d'accès Twitter", "twitter");
  }
};

/**
 * Récupère les informations de l'utilisateur Twitter
 */
export const getTwitterUserInfo = async (accessToken: string): Promise<TwitterUser> => {
  console.log(`[Twitter] Récupération des informations utilisateur...`);
  
  try {
    const response = await fetch("https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics", {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur Twitter API: ${errorData.title || response.statusText}`);
    }

    const userData = await response.json();
    console.log(`[Twitter] Informations utilisateur récupérées:`, userData.data);
    return userData.data;
    
  } catch (error) {
    console.error(`[Twitter] Erreur lors de la récupération des infos utilisateur:`, error);
    throw new AuthError("Impossible de récupérer les informations utilisateur Twitter", "twitter");
  }
};

/**
 * Sauvegarde les données Twitter dans Firebase
 */
export const saveTwitterDataToFirebase = async (
  userData: TwitterUser, 
  accessToken: string, 
  refreshToken?: string,
  expiresIn?: number
): Promise<void> => {
  try {
    const expiresAt = expiresIn ? Date.now() + (expiresIn * 1000) : Date.now() + (7200 * 1000); // 2h par défaut
    
    await saveSocialAccountToFirebase({
      platform: "twitter",
      name: "Twitter",
      username: `@${userData.username}`,
      accessToken,
      refreshToken,
      expiresAt,
      connectedAt: new Date().toISOString(),
      userInfo: {
        id: userData.id,
        name: userData.name,
        email: userData.username
      }
    });
    
    console.log(`[Twitter] Données sauvegardées dans Firebase pour @${userData.username}`);
  } catch (error) {
    console.error(`[Twitter] Erreur lors de la sauvegarde dans Firebase:`, error);
    throw error;
  }
};

/**
 * Publie un tweet
 */
export const publishTweet = async (accessToken: string, content: string): Promise<any> => {
  console.log(`[Twitter] Publication d'un tweet...`);
  
  try {
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        text: content
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur lors de la publication: ${errorData.title || response.statusText}`);
    }

    const result = await response.json();
    console.log(`[Twitter] Tweet publié avec succès:`, result.data);
    return result.data;
    
  } catch (error) {
    console.error(`[Twitter] Erreur lors de la publication:`, error);
    throw error;
  }
};
