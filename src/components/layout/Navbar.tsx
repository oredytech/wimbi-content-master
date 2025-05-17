
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md py-4 px-4 md:px-6 shadow-sm border-b fixed w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold gradient-text">Wimbi Master</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/features" className="text-gray-700 hover:text-wimbi transition-colors">
            Fonctionnalités
          </Link>
          <Link to="/pricing" className="text-gray-700 hover:text-wimbi transition-colors">
            Tarification
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-wimbi transition-colors">
            À propos
          </Link>
          <Link to="/login">
            <Button variant="outline" className="mr-2">Connexion</Button>
          </Link>
          <Link to="/signup">
            <Button>Essai Gratuit</Button>
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t py-4 px-4 z-50">
          <div className="flex flex-col space-y-4">
            <Link to="/features" className="text-gray-700 hover:text-wimbi py-2 transition-colors">
              Fonctionnalités
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-wimbi py-2 transition-colors">
              Tarification
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-wimbi py-2 transition-colors">
              À propos
            </Link>
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full">Connexion</Button>
            </Link>
            <Link to="/signup" className="w-full">
              <Button className="w-full">Essai Gratuit</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
