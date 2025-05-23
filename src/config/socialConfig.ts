
// Configuration des APIs réseaux sociaux

// URL de base pour les redirections
const BASE_URL = import.meta.env.VITE_BASE_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5173' :
   window.location.hostname.includes('netlify.app') ? 'https://wimbimaster.netlify.app' :
   'https://wimbimaster.com');

export const socialConfig = {
  facebook: {
    appId: "1454263535543676",
    redirectUri: `${BASE_URL}/auth/facebook/callback`,
    scopes: ["email", "public_profile", "pages_manage_posts", "pages_read_engagement", "pages_show_list"],
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
    scopes: ["user_profile", "user_media"],
  },
  wordpress: {
    // Configuration générique simplifiée
    apiBase: "/wp-json/wp/v2",
    authBase: "/wp-json/jwt-auth/v1",
  }
};

// Types pour les différentes plateformes
export type SocialPlatform = "facebook" | "twitter" | "instagram" | "linkedin";
