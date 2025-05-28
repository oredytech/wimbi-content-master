
import { AccessToken } from "@/services/oauth/types";
import { SocialPost, PublishResult } from "../types";
import { publishTweet } from "@/services/oauth/twitter/twitterAuthService";

/**
 * Publie sur Twitter
 * @param accessToken Token d'accès
 * @param post Données de la publication
 * @returns Résultat de la publication
 */
export const publishToTwitter = async (accessToken: AccessToken, post: SocialPost): Promise<PublishResult> => {
  try {
    console.log("[Social] Publication sur Twitter:", post);
    
    // Vérifier la longueur du tweet
    if (post.content.length > 280) {
      return {
        success: false,
        platform: "twitter",
        error: "Le contenu dépasse la limite de 280 caractères"
      };
    }
    
    // Publier le tweet via l'API Twitter
    const tweetResult = await publishTweet(accessToken.value, post.content);
    
    return {
      success: true,
      platform: "twitter",
      postId: tweetResult.id,
      postUrl: `https://twitter.com/user/status/${tweetResult.id}`
    };
  } catch (error) {
    console.error("[Social] Erreur lors de la publication sur Twitter:", error);
    return {
      success: false,
      platform: "twitter",
      error: error instanceof Error ? error.message : "Erreur lors de la publication sur Twitter"
    };
  }
};
