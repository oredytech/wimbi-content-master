
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types pour les sites WordPress
export type WordPressSite = {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected';
  posts: number;
  lastSync?: string;
};

// Types pour les réseaux sociaux
export type SocialAccount = {
  id: string;
  name: 'Facebook' | 'Twitter' | 'Instagram' | 'LinkedIn';
  username: string;
  connected: boolean;
  icon: any;
  color: string;
};

// Types pour les publications planifiées
export type ScheduledPost = {
  id: string;
  content: string;
  date: string;
  platforms: string[];
};

// Types pour les publications récentes
export type RecentPublication = {
  id: string;
  title: string;
  date: string;
  wordpress: number;
  social: number;
};

// Types pour les paramètres utilisateur
export type UserProfile = {
  name: string;
  email: string;
  company: string;
  bio: string;
};

export type UserSettings = {
  profile: UserProfile;
  notifications: {
    email: boolean;
    push: boolean;
    publications: boolean;
  };
  apiKey: string;
};

interface AppContextType {
  wordpressSites: WordPressSite[];
  addWordPressSite: (site: Omit<WordPressSite, 'id'>) => void;
  removeWordPressSite: (id: string) => void;
  updateWordPressSite: (id: string, site: Partial<WordPressSite>) => void;
  
  socialAccounts: SocialAccount[];
  addSocialAccount: (account: Omit<SocialAccount, 'id'>) => void;
  removeSocialAccount: (id: string) => void;
  toggleSocialConnection: (id: string) => void;
  
  scheduledPosts: ScheduledPost[];
  addScheduledPost: (post: Omit<ScheduledPost, 'id'>) => void;
  removeScheduledPost: (id: string) => void;
  
  recentPublications: RecentPublication[];
  
  userSettings: UserSettings;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateUserNotifications: (notifications: Partial<UserSettings['notifications']>) => void;
  updateApiKey: (apiKey: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext doit être utilisé à l\'intérieur d\'un AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // État pour les sites WordPress
  const [wordpressSites, setWordpressSites] = useState<WordPressSite[]>([
    { id: '1', name: "Blog Marketing", url: "https://blog-marketing.com", status: "connected", posts: 24 },
    { id: '2', name: "Site E-commerce", url: "https://mon-ecommerce.com", status: "connected", posts: 12 },
    { id: '3', name: "Site Corporate", url: "https://entreprise.com", status: "connected", posts: 8 },
  ]);

  // État pour les réseaux sociaux
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);

  // État pour les publications planifiées
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    { id: '1', content: "Découvrez notre nouvel article sur les tendances marketing 2025", date: "2025-05-20 14:00", platforms: ["Facebook", "Twitter", "LinkedIn"] },
    { id: '2', content: "Comment optimiser votre stratégie de contenu ? Lisez notre dernier guide", date: "2025-05-22 10:30", platforms: ["Facebook", "Instagram"] },
  ]);

  // État pour les publications récentes
  const [recentPublications, setRecentPublications] = useState<RecentPublication[]>([
    { id: '1', title: "Les tendances marketing 2025", date: "2025-05-15", wordpress: 3, social: 4 },
    { id: '2', title: "Comment optimiser son SEO", date: "2025-05-10", wordpress: 2, social: 3 },
    { id: '3', title: "Guide des réseaux sociaux", date: "2025-05-05", wordpress: 5, social: 4 },
  ]);

  // État pour les paramètres utilisateur
  const [userSettings, setUserSettings] = useState<UserSettings>({
    profile: {
      name: "Jean Dupont",
      email: "jean.dupont@exemple.fr",
      company: "Marketing Genius",
      bio: "Spécialiste en marketing digital et content manager",
    },
    notifications: {
      email: true,
      push: true,
      publications: true,
    },
    apiKey: "sk_live_WimbiMaster_8x7dQ9p2z5",
  });

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const storedWordPressSites = localStorage.getItem('wordpressSites');
    if (storedWordPressSites) {
      setWordpressSites(JSON.parse(storedWordPressSites));
    }
    
    const storedSocialAccounts = localStorage.getItem('socialAccounts');
    if (storedSocialAccounts) {
      setSocialAccounts(JSON.parse(storedSocialAccounts));
    } else {
      // Importer les icônes ici pour éviter les problèmes de sérialisation
      // en initialisant avec des valeurs par défaut
      import('lucide-react').then(({ Facebook, Twitter, Instagram, Linkedin }) => {
        setSocialAccounts([
          { id: '1', name: "Facebook", username: "entreprise.marketing", connected: true, icon: "Facebook", color: "bg-blue-600" },
          { id: '2', name: "Twitter", username: "@entreprise_mktg", connected: true, icon: "Twitter", color: "bg-sky-500" },
          { id: '3', name: "Instagram", username: "@entreprise.marketing", connected: true, icon: "Instagram", color: "bg-pink-600" },
          { id: '4', name: "LinkedIn", username: "Entreprise Marketing", connected: false, icon: "Linkedin", color: "bg-blue-700" },
        ]);
      });
    }

    const storedScheduledPosts = localStorage.getItem('scheduledPosts');
    if (storedScheduledPosts) {
      setScheduledPosts(JSON.parse(storedScheduledPosts));
    }

    const storedRecentPublications = localStorage.getItem('recentPublications');
    if (storedRecentPublications) {
      setRecentPublications(JSON.parse(storedRecentPublications));
    }

    const storedUserSettings = localStorage.getItem('userSettings');
    if (storedUserSettings) {
      setUserSettings(JSON.parse(storedUserSettings));
    }
  }, []);

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('wordpressSites', JSON.stringify(wordpressSites));
  }, [wordpressSites]);

  useEffect(() => {
    // Nous ne sauvegardons pas les icônes qui sont des composants React
    const serializableSocialAccounts = socialAccounts.map(({ icon, ...rest }) => ({
      ...rest,
      icon: rest.name, // Sauvegarder juste le nom de l'icône
    }));
    localStorage.setItem('socialAccounts', JSON.stringify(serializableSocialAccounts));
  }, [socialAccounts]);

  useEffect(() => {
    localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));
  }, [scheduledPosts]);

  useEffect(() => {
    localStorage.setItem('recentPublications', JSON.stringify(recentPublications));
  }, [recentPublications]);

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
  }, [userSettings]);

  // Fonctions pour gérer les sites WordPress
  const addWordPressSite = (site: Omit<WordPressSite, 'id'>) => {
    const newSite = {
      ...site,
      id: Date.now().toString(),
    };
    setWordpressSites([...wordpressSites, newSite]);
  };

  const removeWordPressSite = (id: string) => {
    setWordpressSites(wordpressSites.filter(site => site.id !== id));
  };

  const updateWordPressSite = (id: string, updates: Partial<WordPressSite>) => {
    setWordpressSites(
      wordpressSites.map(site => 
        site.id === id ? { ...site, ...updates } : site
      )
    );
  };

  // Fonctions pour gérer les réseaux sociaux
  const addSocialAccount = (account: Omit<SocialAccount, 'id'>) => {
    const newAccount = {
      ...account,
      id: Date.now().toString(),
    };
    setSocialAccounts([...socialAccounts, newAccount]);
  };

  const removeSocialAccount = (id: string) => {
    setSocialAccounts(socialAccounts.filter(account => account.id !== id));
  };

  const toggleSocialConnection = (id: string) => {
    setSocialAccounts(
      socialAccounts.map(account => 
        account.id === id ? { ...account, connected: !account.connected } : account
      )
    );
  };

  // Fonctions pour gérer les publications planifiées
  const addScheduledPost = (post: Omit<ScheduledPost, 'id'>) => {
    const newPost = {
      ...post,
      id: Date.now().toString(),
    };
    setScheduledPosts([...scheduledPosts, newPost]);
  };

  const removeScheduledPost = (id: string) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
  };

  // Fonctions pour gérer les paramètres utilisateur
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserSettings({
      ...userSettings,
      profile: {
        ...userSettings.profile,
        ...profile,
      },
    });
  };

  const updateUserNotifications = (notifications: Partial<UserSettings['notifications']>) => {
    setUserSettings({
      ...userSettings,
      notifications: {
        ...userSettings.notifications,
        ...notifications,
      },
    });
  };

  const updateApiKey = (apiKey: string) => {
    setUserSettings({
      ...userSettings,
      apiKey,
    });
  };

  const value = {
    wordpressSites,
    addWordPressSite,
    removeWordPressSite,
    updateWordPressSite,
    
    socialAccounts,
    addSocialAccount,
    removeSocialAccount,
    toggleSocialConnection,
    
    scheduledPosts,
    addScheduledPost,
    removeScheduledPost,
    
    recentPublications,
    
    userSettings,
    updateUserProfile,
    updateUserNotifications,
    updateApiKey,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
