
import { SocialPlatform } from "@/config/socialConfig";

// Classe pour gérer les erreurs d'authentification
export class AuthError extends Error {
  constructor(message: string, public platform: SocialPlatform, public errorCode?: string) {
    super(message);
    this.name = "AuthError";
    
    // Ajouter des conseils spécifiques selon la plateforme
    let appendix = "";
    
    switch (platform) {
      case "facebook":
        appendix = "\n\nConseil: Vérifiez que votre application Facebook est correctement configurée avec les permissions requises.";
        break;
      case "twitter":
        appendix = "\n\nConseil: Vérifiez que votre application Twitter a bien les autorisations de lecture/écriture.";
        break;
      case "linkedin":
        appendix = "\n\nConseil: Assurez-vous que votre application LinkedIn possède les scopes 'w_member_social'.";
        break;
      case "instagram":
        appendix = "\n\nConseil: Assurez-vous que votre compte Instagram est un compte Business connecté à une Page Facebook.";
        break;
    }
    
    this.message = message + appendix;
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
  redirectUrl?: string;
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
