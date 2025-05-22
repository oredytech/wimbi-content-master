
// Configuration des APIs réseaux sociaux
// IMPORTANT: Dans un environnement de production réel, ces clés devraient être 
// stockées dans des variables d'environnement côté serveur

// URL de base pour les redirections
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://wimbimaster.netlify.app";

export const socialConfig = {
  facebook: {
    appId: import.meta.env.VITE_FACEBOOK_APP_ID || "1454263535543676",
    apiKey: import.meta.env.VITE_FACEBOOK_API_KEY || "50c7851bff54bab8fd64d2d6cbf79dfc",
    redirectUri: `${BASE_URL}/auth/facebook/callback`,
    scopes: ["pages_show_list", "pages_read_engagement", "pages_manage_posts", "pages_manage_metadata", "public_profile", "email"],
  },
  twitter: {
    clientId: import.meta.env.VITE_TWITTER_CLIENT_ID || "GgVlmwz1yiICgc1dtuyy0PDXK",
    clientSecret: import.meta.env.VITE_TWITTER_CLIENT_SECRET || "IN15fljCWLsNBkgRILLErb5JmIK1F7L8LkaDsyXKhGV2RkGltA",
    bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN || "AAAAAAAAAAAAAAAAAAAAAJt91wEAAAAAyuEBCSCpNDoUAI1rr4WB8LOLG%2BE%3DLwS4Dww6ODHS7U5gEAPpKTuJuQbJKMnwkjrhvmoRp3okuwVylF",
    redirectUri: `${BASE_URL}/auth/twitter/callback`,
    scopes: ["tweet.read", "tweet.write", "users.read"],
  },
  linkedin: {
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || "77r67add6bkwf3",
    clientSecret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET || "WPL_AP1.1m8gGQUZ5nTE44mI.pcZzPg==",
    redirectUri: `${BASE_URL}/auth/linkedin/callback`,
    scopes: ["r_liteprofile", "r_emailaddress", "w_member_social"],
  },
  instagram: {
    // Utilise les mêmes clés que Facebook mais avec des scopes différents
    appId: import.meta.env.VITE_FACEBOOK_APP_ID || "1454263535543676",
    apiKey: import.meta.env.VITE_FACEBOOK_API_KEY || "50c7851bff54bab8fd64d2d6cbf79dfc",
    redirectUri: `${BASE_URL}/auth/instagram/callback`,
    scopes: ["instagram_basic", "instagram_content_publish", "pages_show_list", "pages_read_engagement"],
  },
  wordpress: {
    // Configuration générique, chaque site WordPress aura ses propres credentials
    apiBase: "/wp-json/wp/v2",
    authBase: "/wp-json/jwt-auth/v1",
  }
};

// Types pour les différentes plateformes
export type SocialPlatform = "facebook" | "twitter" | "instagram" | "linkedin";
