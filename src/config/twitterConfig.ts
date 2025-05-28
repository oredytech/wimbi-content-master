
// Configuration Twitter OAuth 2.0
export const twitterConfig = {
  clientId: "Z0IzTWxSZndCTEpxMEVSaERBUk06MTpjaQ",
  clientSecret: "5kxKM68Mx8eUptkic2O_AqY93LlVgJCr6gfmkjsg_LpanOMNy-",
  redirectUri: `${window.location.origin}/auth/twitter/callback`,
  scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
  apiUrl: "https://api.twitter.com/2"
};
