
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Settings } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      path
    );
  }, [path]);

  // Suggérer des redirections basées sur le chemin
  const getSuggestions = () => {
    if (path.includes('dashboard')) {
      return [
        { to: '/dashboard', label: 'Tableau de bord', icon: Home },
        { to: '/dashboard/social', label: 'Réseaux sociaux', icon: Settings },
        { to: '/dashboard/contents', label: 'Mes contenus', icon: Settings },
        { to: '/dashboard/wordpress', label: 'Sites WordPress', icon: Settings },
      ];
    }
    return [
      { to: '/', label: 'Accueil', icon: Home },
      { to: '/features', label: 'Fonctionnalités', icon: Settings },
      { to: '/pricing', label: 'Tarification', icon: Settings },
    ];
  };

  const suggestions = getSuggestions();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-4">Page non trouvée</p>
        <p className="text-gray-600 mb-2">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <p className="text-gray-500 mb-8">
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{path}</code>
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {suggestions.map((suggestion) => (
            <Link key={suggestion.to} to={suggestion.to}>
              <Button variant="outline" className="flex items-center w-full">
                <suggestion.icon className="mr-2 h-4 w-4" />
                {suggestion.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tableau de bord
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
