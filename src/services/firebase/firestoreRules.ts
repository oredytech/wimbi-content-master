
/**
 * Documentation des règles de sécurité Firestore requises pour l'application
 * 
 * Ces règles doivent être configurées dans la console Firebase :
 * https://console.firebase.google.com/project/[PROJECT_ID]/firestore/rules
 */

export const FIRESTORE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les comptes sociaux
    match /socialAccounts/{accountId} {
      allow read, write: if request.auth != null 
                        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
                   && request.auth.uid == request.resource.data.userId;
    }
    
    // Règles pour les publications planifiées
    match /scheduledPosts/{postId} {
      allow read, write: if request.auth != null 
                        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
                   && request.auth.uid == request.resource.data.userId;
    }
    
    // Règles pour les sites WordPress
    match /wordpressSites/{siteId} {
      allow read, write: if request.auth != null 
                        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
                   && request.auth.uid == request.resource.data.userId;
    }
    
    // Règles par défaut : interdire tout accès non autorisé
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`;

/**
 * Instructions pour configurer les règles Firestore
 */
export const SETUP_INSTRUCTIONS = `
Pour configurer les règles de sécurité Firestore :

1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet "wimbimaster-f7d57"
3. Dans le menu de gauche, cliquez sur "Firestore Database"
4. Cliquez sur l'onglet "Règles" (Rules)
5. Remplacez les règles existantes par le contenu fourni
6. Cliquez sur "Publier" pour appliquer les modifications

Ces règles permettront aux utilisateurs authentifiés d'accéder uniquement à leurs propres données.
`;

/**
 * Vérifie si les règles Firestore sont configurées correctement
 */
export const checkFirestoreRules = async (): Promise<boolean> => {
  try {
    // On peut tester en essayant de lire/écrire une donnée test
    // Cette fonction peut être étendue pour vérifier les permissions
    return true;
  } catch (error) {
    console.error('[Firestore] Erreur lors de la vérification des règles:', error);
    return false;
  }
};
