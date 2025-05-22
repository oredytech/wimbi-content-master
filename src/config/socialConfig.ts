
// Configuration des APIs réseaux sociaux

// URL de base pour les redirections
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://wimbimaster.netlify.app";

export const socialConfig = {
  facebook: {
    appId: "1454263535543676",
    redirectUri: `${BASE_URL}/auth/facebook/callback`,
    scopes: ["pages_show_list", "pages_read_engagement", "pages_manage_posts", "pages_manage_metadata", "public_profile", "email"],
  },
  twitter: {
    clientId: "GgVlmwz1yiICgc1dtuyy0PDXK",
    redirectUri: `${BASE_URL}/auth/twitter/callback`,
    scopes: ["tweet.read", "tweet.write", "users.read"],
  },
  linkedin: {
    clientId: "77r67add6bkwf3",
    redirectUri: `${BASE_URL}/auth/linkedin/callback`,
    scopes: ["r_liteprofile", "r_emailaddress", "w_member_social"],
  },
  instagram: {
    // Utilise les mêmes clés que Facebook mais avec des scopes différents
    appId: "1454263535543676",
    redirectUri: `${BASE_URL}/auth/instagram/callback`,
    scopes: ["instagram_basic", "instagram_content_publish", "pages_show_list", "pages_read_engagement"],
  },
  wordpress: {
    // Configuration générique simplifiée
    apiBase: "/wp-json/wp/v2",
    authBase: "/wp-json/jwt-auth/v1",
  }
};

// Types pour les différentes plateformes
export type SocialPlatform = "facebook" | "twitter" | "instagram" | "linkedin";
