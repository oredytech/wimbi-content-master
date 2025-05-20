
import { SocialPlatform } from "@/config/socialConfig";

/**
 * Interface pour une publication sociale
 */
export interface SocialPost {
  content: string;
  link?: string;
  mediaUrls?: string[];
  platforms: SocialPlatform[];
  scheduledDate?: Date;
}

/**
 * Résultat d'une publication
 */
export interface PublishResult {
  success: boolean;
  platform: SocialPlatform;
  postId?: string;
  postUrl?: string;
  error?: string;
}
