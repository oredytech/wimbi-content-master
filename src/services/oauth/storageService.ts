
import { SocialPlatform } from "@/config/socialConfig";
import { AccessToken } from "./types";

/**
 * Génère un état aléatoire pour le flux OAuth
 * @returns {string} État aléatoire
 */
export const generateOAuthState = (): string => {
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
 * Enregistre des données temporaires pour le flux OAuth
 */
export const saveOAuthTemporaryData = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

/**
 * Récupère des données temporaires pour le flux OAuth
 */
export const getOAuthTemporaryData = (key: string): string | null => {
  return localStorage.getItem(key);
};

/**
 * Supprime des données temporaires pour le flux OAuth
 */
export const removeOAuthTemporaryData = (key: string): void => {
  localStorage.removeItem(key);
};
