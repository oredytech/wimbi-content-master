
import { FirebaseError } from 'firebase/app';
import { useToast } from '@/hooks/use-toast';

export interface FirebaseErrorInfo {
  code: string;
  message: string;
  userMessage: string;
  suggestedAction?: string;
}

/**
 * Analyse et traduit les erreurs Firebase en messages utilisateur compréhensibles
 */
export const handleFirebaseError = (error: any): FirebaseErrorInfo => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        return {
          code: error.code,
          message: error.message,
          userMessage: "Permissions insuffisantes pour accéder aux données",
          suggestedAction: "Veuillez contacter l'administrateur pour configurer les règles de sécurité"
        };
      
      case 'unauthenticated':
        return {
          code: error.code,
          message: error.message,
          userMessage: "Vous devez être connecté pour effectuer cette action",
          suggestedAction: "Veuillez vous reconnecter à votre compte"
        };
      
      case 'not-found':
        return {
          code: error.code,
          message: error.message,
          userMessage: "Les données demandées n'ont pas été trouvées",
          suggestedAction: "Vérifiez que vos comptes sont correctement configurés"
        };
      
      case 'network-request-failed':
        return {
          code: error.code,
          message: error.message,
          userMessage: "Problème de connexion réseau",
          suggestedAction: "Vérifiez votre connexion internet et réessayez"
        };
      
      default:
        return {
          code: error.code,
          message: error.message,
          userMessage: `Erreur Firebase: ${error.code}`,
          suggestedAction: "Veuillez réessayer ou contacter le support"
        };
    }
  }
  
  return {
    code: 'unknown',
    message: error?.message || 'Erreur inconnue',
    userMessage: "Une erreur inattendue s'est produite",
    suggestedAction: "Veuillez réessayer"
  };
};

/**
 * Hook pour gérer les erreurs Firebase avec des toasts
 */
export const useFirebaseErrorHandler = () => {
  const { toast } = useToast();
  
  const handleError = (error: any, context?: string) => {
    const errorInfo = handleFirebaseError(error);
    
    console.error(`[Firebase Error${context ? ` - ${context}` : ''}]:`, {
      code: errorInfo.code,
      message: errorInfo.message
    });
    
    toast({
      title: "Erreur",
      description: errorInfo.userMessage,
      variant: "destructive",
    });
    
    return errorInfo;
  };
  
  return { handleError };
};
