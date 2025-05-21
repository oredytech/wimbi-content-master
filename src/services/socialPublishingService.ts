
import { SocialPlatform } from "@/config/socialConfig";
import { getAccessToken } from "./oauthService";
import { SocialPost, PublishResult } from "./social/types";
import { publishToFacebook } from "./social/platformPublishers/facebookPublisher";
import { publishToTwitter } from "./social/platformPublishers/twitterPublisher";
import { publishToLinkedin } from "./social/platformPublishers/linkedinPublisher";
import { publishToInstagram } from "./social/platformPublishers/instagramPublisher";

// Réexporter les types
export type { SocialPost, PublishResult } from "./social/types";

/**
 * Service pour la publication sur les réseaux sociaux
 */
export class SocialPublishingService {
  /**
   * Vérifie si un utilisateur est connecté à une plateforme
   * @param platform Plateforme sociale
   * @returns {boolean} True si connecté, sinon false
   */
  static isConnectedTo(platform: SocialPlatform): boolean {
    const token = getAccessToken(platform);
    return !!token;
  }

  /**
   * Publie sur les réseaux sociaux sélectionnés
   * @param post Données de la publication
   * @returns Résultat des publications
   */
  static async publishToSocialMedia(post: SocialPost): Promise<PublishResult[]> {
    const results: PublishResult[] = [];
    
    for (const platform of post.platforms) {
      const accessToken = getAccessToken(platform);
      
      if (!accessToken) {
        results.push({
          success: false,
          platform,
          error: `Non connecté à ${platform}`
        });
        continue;
      }
      
      let result: PublishResult;
      
      switch (platform) {
        case "facebook":
          result = await publishToFacebook(accessToken, post);
          break;
        case "twitter":
          result = await publishToTwitter(accessToken, post);
          break;
        case "linkedin":
          result = await publishToLinkedin(accessToken, post);
          break;
        case "instagram":
          result = await publishToInstagram(accessToken, post);
          break;
        default:
          result = {
            success: false,
            platform: platform as SocialPlatform,
            error: `Plateforme non supportée: ${platform}`
          };
      }
      
      results.push(result);
    }
    
    return results;
  }
}
