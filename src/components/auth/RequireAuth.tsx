
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    console.log("RequireAuth: Vérification de l'authentification...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("RequireAuth: État de l'authentification changé, utilisateur:", user ? "connecté" : "déconnecté");
      setIsAuthenticated(!!user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    console.log("RequireAuth: En attente de vérification...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wimbi"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("RequireAuth: Non authentifié, redirection vers login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, show children
  console.log("RequireAuth: Authentifié, affichage du contenu protégé");
  return <>{children}</>;
};

export default RequireAuth;
