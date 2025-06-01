
import { doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { SocialPlatform } from '@/config/socialConfig';
import { handleFirebaseError } from './errorService';

export interface FirebaseSocialAccount {
  id: string;
  userId: string;
  platform: SocialPlatform;
  name: string;
  username: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  connectedAt: string;
  lastSync?: string;
  // Données spécifiques à Facebook
  pages?: {
    id: string;
    name: string;
    access_token: string;
    category: string;
    tasks?: string[];
  }[];
  userInfo?: {
    id: string;
    name: string;
    email?: string;
  };
}

/**
 * Vérifie que l'utilisateur est connecté
 */
const ensureUserAuthenticated = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Utilisateur non connecté. Veuillez vous connecter avant de gérer vos comptes sociaux.');
  }
  return user;
};

/**
 * Sauvegarde un compte social dans Firestore avec gestion d'erreur améliorée
 */
export const saveSocialAccountToFirebase = async (accountData: Omit<FirebaseSocialAccount, 'id' | 'userId'>): Promise<string> => {
  try {
    const user = ensureUserAuthenticated();

    const accountId = `${user.uid}_${accountData.platform}_${Date.now()}`;
    const socialAccountRef = doc(db, 'socialAccounts', accountId);

    const socialAccount: FirebaseSocialAccount = {
      id: accountId,
      userId: user.uid,
      ...accountData
    };

    await setDoc(socialAccountRef, socialAccount);
    console.log(`[Firebase] Compte ${accountData.platform} sauvegardé pour l'utilisateur ${user.uid}`);
    
    return accountId;
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    console.error(`[Firebase] Erreur lors de la sauvegarde du compte ${accountData.platform}:`, errorInfo);
    
    // Pour l'instant, on sauvegarde localement si Firebase échoue
    if (errorInfo.code === 'permission-denied') {
      console.warn('[Firebase] Permissions insuffisantes, sauvegarde locale temporaire');
      const localData = {
        ...accountData,
        id: `local_${accountData.platform}_${Date.now()}`,
        userId: 'local_user',
        savedLocally: true
      };
      localStorage.setItem(`social_account_${accountData.platform}`, JSON.stringify(localData));
      return localData.id;
    }
    
    throw error;
  }
};

/**
 * Récupère tous les comptes sociaux d'un utilisateur avec fallback local
 */
export const getUserSocialAccounts = async (): Promise<FirebaseSocialAccount[]> => {
  try {
    const user = ensureUserAuthenticated();

    const socialAccountsRef = collection(db, 'socialAccounts');
    const q = query(socialAccountsRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);

    const accounts: FirebaseSocialAccount[] = [];
    querySnapshot.forEach((doc) => {
      accounts.push(doc.data() as FirebaseSocialAccount);
    });

    console.log(`[Firebase] ${accounts.length} comptes sociaux récupérés pour l'utilisateur ${user.uid}`);
    return accounts;
  } catch (error) {
    const errorInfo = handleFirebaseError(error);
    console.error('[Firebase] Erreur lors de la récupération des comptes:', errorInfo);
    
    // Fallback vers le stockage local si Firebase échoue
    if (errorInfo.code === 'permission-denied') {
      console.warn('[Firebase] Permissions insuffisantes, récupération locale');
      const localAccounts: FirebaseSocialAccount[] = [];
      
      ['facebook', 'twitter', 'instagram', 'linkedin'].forEach(platform => {
        const localData = localStorage.getItem(`social_account_${platform}`);
        if (localData) {
          try {
            const account = JSON.parse(localData);
            localAccounts.push(account);
          } catch (e) {
            console.warn(`Données locales corrompues pour ${platform}`);
          }
        }
      });
      
      return localAccounts;
    }
    
    return [];
  }
};

/**
 * Vérifie si un utilisateur a déjà connecté une plateforme
 */
export const isplatformConnected = async (platform: SocialPlatform): Promise<boolean> => {
  try {
    const user = ensureUserAuthenticated();

    const socialAccountsRef = collection(db, 'socialAccounts');
    const q = query(
      socialAccountsRef, 
      where('userId', '==', user.uid),
      where('platform', '==', platform)
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error(`[Firebase] Erreur lors de la vérification de connexion pour ${platform}:`, error);
    
    // Fallback local
    const localData = localStorage.getItem(`social_account_${platform}`);
    return !!localData;
  }
};

/**
 * Récupère un compte social spécifique
 */
export const getSocialAccount = async (platform: SocialPlatform): Promise<FirebaseSocialAccount | null> => {
  try {
    const user = ensureUserAuthenticated();

    const socialAccountsRef = collection(db, 'socialAccounts');
    const q = query(
      socialAccountsRef, 
      where('userId', '==', user.uid),
      where('platform', '==', platform)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Fallback local
      const localData = localStorage.getItem(`social_account_${platform}`);
      if (localData) {
        return JSON.parse(localData);
      }
      return null;
    }

    return querySnapshot.docs[0].data() as FirebaseSocialAccount;
  } catch (error) {
    console.error(`[Firebase] Erreur lors de la récupération du compte ${platform}:`, error);
    
    // Fallback local
    const localData = localStorage.getItem(`social_account_${platform}`);
    if (localData) {
      return JSON.parse(localData);
    }
    
    return null;
  }
};

/**
 * Supprime un compte social
 */
export const removeSocialAccountFromFirebase = async (platform: SocialPlatform): Promise<void> => {
  try {
    const user = ensureUserAuthenticated();

    const socialAccountsRef = collection(db, 'socialAccounts');
    const q = query(
      socialAccountsRef, 
      where('userId', '==', user.uid),
      where('platform', '==', platform)
    );
    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log(`[Firebase] Compte ${platform} supprimé pour l'utilisateur ${user.uid}`);
  } catch (error) {
    console.error(`[Firebase] Erreur lors de la suppression du compte ${platform}:`, error);
    
    // Fallback local
    localStorage.removeItem(`social_account_${platform}`);
    console.log(`[Local] Compte ${platform} supprimé du stockage local`);
  }
};

/**
 * Met à jour la date de dernière synchronisation
 */
export const updateLastSync = async (platform: SocialPlatform): Promise<void> => {
  try {
    const user = ensureUserAuthenticated();

    const socialAccountsRef = collection(db, 'socialAccounts');
    const q = query(
      socialAccountsRef, 
      where('userId', '==', user.uid),
      where('platform', '==', platform)
    );
    const querySnapshot = await getDocs(q);

    const updatePromises = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, { lastSync: new Date().toISOString() })
    );
    await Promise.all(updatePromises);
  } catch (error) {
    console.error(`[Firebase] Erreur lors de la mise à jour de lastSync pour ${platform}:`, error);
  }
};
