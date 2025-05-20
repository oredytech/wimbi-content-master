
import { SocialPlatform } from "@/config/socialConfig";

// Classe pour gérer les erreurs d'authentification
export class AuthError extends Error {
  constructor(message: string, public platform: SocialPlatform, public errorCode?: string) {
    super(message);
    this.name = "AuthError";
  }
}

// Interface pour un token d'accès
export interface AccessToken {
  value: string;
  expiresAt: number; // timestamp expiration
  refreshToken?: string;
  tokenType?: string;
}

// Interface pour le résultat d'une opération OAuth
export interface OAuthResult {
  success: boolean;
  error?: string;
}

// Interface pour les informations d'un site WordPress
export interface WordPressSiteInfo {
  name: string;
  url: string;
  status: "connected" | "disconnected" | "error";
  posts: number;
  userId: string;
  username: string;
  authMethod: string;
  lastSync: string;
}

// Interface pour le résultat de connexion WordPress
export interface WordPressConnectionResult {
  success: boolean;
  siteInfo?: WordPressSiteInfo;
  error?: string;
}
