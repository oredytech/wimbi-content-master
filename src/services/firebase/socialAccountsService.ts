
import { doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { SocialPlatform } from '@/config/socialConfig';

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
 * Sauvegarde un compte social dans Firestore
 */
export const saveSocialAccountToFirebase = async (accountData: Omit<FirebaseSocialAccount, 'id' | 'userId'>): Promise<string> => {
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
};

/**
 * Récupère tous les comptes sociaux d'un utilisateur
 */
export const getUserSocialAccounts = async (): Promise<FirebaseSocialAccount[]> => {
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
    return false;
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

    if (querySnapshot.empty) return null;

    // Retourner le premier compte trouvé (il ne devrait y en avoir qu'un par plateforme)
    return querySnapshot.docs[0].data() as FirebaseSocialAccount;
  } catch (error) {
    console.error(`[Firebase] Erreur lors de la récupération du compte ${platform}:`, error);
    return null;
  }
};

/**
 * Supprime un compte social
 */
export const removeSocialAccountFromFirebase = async (platform: SocialPlatform): Promise<void> => {
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
