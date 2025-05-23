
import { socialConfig } from "@/config/socialConfig";
import { AuthError } from "./types";

/**
 * Interface pour les données de page Facebook
 */
export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
  tasks?: string[];
}

/**
 * Interface pour la réponse de l'API Facebook
 */
export interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

/**
 * Interface pour les données utilisateur Facebook
 */
export interface FacebookUser {
  id: string;
  name: string;
  email?: string;
}

/**
 * Simule l'échange du code d'autorisation contre un access token
 * En production, cette fonction devrait être exécutée côté serveur pour des raisons de sécurité
 */
export const exchangeFacebookCodeForToken = async (code: string): Promise<FacebookTokenResponse> => {
  console.log(`[Facebook] Échange du code d'autorisation: ${code.substring(0, 10)}...`);
  
  // IMPORTANT: En production, cette requête DOIT être faite côté serveur
  // car elle nécessite l'app_secret qui ne doit JAMAIS être exposé côté client
  
  try {
    // Simulation de l'appel API réel (en production, faire ceci côté serveur)
    /*
    const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: socialConfig.facebook.appId,
        client_secret: process.env.FACEBOOK_APP_SECRET, // CÔTÉ SERVEUR UNIQUEMENT
        redirect_uri: socialConfig.facebook.redirectUri,
        code: code,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur Facebook API: ${response.status}`);
    }
    
    const tokenData = await response.json();
    */
    
    // Simulation pour la démo (à remplacer par l'appel API réel côté serveur)
    const tokenData: FacebookTokenResponse = {
      access_token: `facebook_user_token_${Date.now()}_${code.substring(0, 8)}`,
      token_type: "Bearer",
      expires_in: 3600
    };
    
    console.log(`[Facebook] Token utilisateur obtenu avec succès`);
    return tokenData;
    
  } catch (error) {
    console.error(`[Facebook] Erreur lors de l'échange du code:`, error);
    throw new AuthError("Impossible d'obtenir le token d'accès Facebook", "facebook");
  }
};

/**
 * Récupère les informations de l'utilisateur Facebook
 */
export const getFacebookUserInfo = async (accessToken: string): Promise<FacebookUser> => {
  console.log(`[Facebook] Récupération des informations utilisateur...`);
  
  try {
    // Simulation de l'appel API réel
    /*
    const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
    
    if (!response.ok) {
      throw new Error(`Erreur Facebook API: ${response.status}`);
    }
    
    const userData = await response.json();
    */
    
    // Simulation pour la démo
    const userData: FacebookUser = {
      id: `fb_user_${Date.now()}`,
      name: "Utilisateur Facebook",
      email: "user@exemple.com"
    };
    
    console.log(`[Facebook] Informations utilisateur récupérées:`, userData);
    return userData;
    
  } catch (error) {
    console.error(`[Facebook] Erreur lors de la récupération des infos utilisateur:`, error);
    throw new AuthError("Impossible de récupérer les informations utilisateur", "facebook");
  }
};

/**
 * Récupère les pages Facebook de l'utilisateur avec leurs tokens d'accès
 */
export const getFacebookPages = async (userAccessToken: string): Promise<FacebookPage[]> => {
  console.log(`[Facebook] Récupération des pages utilisateur...`);
  
  try {
    // Simulation de l'appel API réel
    /*
    const response = await fetch(`https://graph.facebook.com/me/accounts?access_token=${userAccessToken}`);
    
    if (!response.ok) {
      throw new Error(`Erreur Facebook API: ${response.status}`);
    }
    
    const pagesData = await response.json();
    return pagesData.data;
    */
    
    // Simulation pour la démo - génère des pages d'exemple
    const simulatedPages: FacebookPage[] = [
      {
        id: `page_${Date.now()}_1`,
        name: "Ma Page Business",
        access_token: `page_token_${Date.now()}_1`,
        category: "Business",
        tasks: ["MANAGE", "CREATE_CONTENT", "PUBLISH_POSTS"]
      },
      {
        id: `page_${Date.now()}_2`,
        name: "Blog Marketing",
        access_token: `page_token_${Date.now()}_2`,
        category: "Blog",
        tasks: ["MANAGE", "CREATE_CONTENT", "PUBLISH_POSTS"]
      }
    ];
    
    console.log(`[Facebook] ${simulatedPages.length} pages récupérées:`, simulatedPages);
    return simulatedPages;
    
  } catch (error) {
    console.error(`[Facebook] Erreur lors de la récupération des pages:`, error);
    throw new AuthError("Impossible de récupérer les pages Facebook", "facebook");
  }
};

/**
 * Sauvegarde les données Facebook dans le localStorage
 * En production, ceci devrait être sauvegardé dans une base de données sécurisée
 */
export const saveFacebookData = (userData: FacebookUser, userToken: string, pages: FacebookPage[]): void => {
  const facebookData = {
    user: userData,
    userToken,
    pages,
    connectedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString() // 1 heure
  };
  
  localStorage.setItem('facebook_data', JSON.stringify(facebookData));
  console.log(`[Facebook] Données sauvegardées pour l'utilisateur ${userData.name}`);
};

/**
 * Récupère les données Facebook sauvegardées
 */
export const getSavedFacebookData = () => {
  const data = localStorage.getItem('facebook_data');
  return data ? JSON.parse(data) : null;
};

/**
 * Vérifie si l'utilisateur a des pages Facebook connectées
 */
export const hasFacebookPages = (): boolean => {
  const data = getSavedFacebookData();
  return data && data.pages && data.pages.length > 0;
};
