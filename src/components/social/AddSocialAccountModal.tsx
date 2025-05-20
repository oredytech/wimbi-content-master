
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { initiateOAuthFlow } from '@/services/oauthService';

interface AddSocialAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSocialAccountModal: React.FC<AddSocialAccountModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const socialPlatforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600", buttonColor: "bg-blue-600 hover:bg-blue-700" },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-sky-500", buttonColor: "bg-sky-500 hover:bg-sky-600" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-600", buttonColor: "bg-pink-600 hover:bg-pink-700" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700", buttonColor: "bg-blue-700 hover:bg-blue-800" },
  ];

  const handleConnectPlatform = async (platformId: string) => {
    setIsLoading(platformId);
    
    try {
      const result = initiateOAuthFlow(platformId as "facebook" | "twitter" | "instagram" | "linkedin");
      
      if (!result.success) {
        toast({
          title: "Erreur de connexion",
          description: result.error || "Impossible de démarrer le processus d'authentification",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la connexion au réseau social",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un réseau social</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Connectez vos comptes de réseaux sociaux pour publier et gérer votre contenu directement depuis WimbiMaster.
          </p>
          
          <div className="grid gap-3">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <Button
                  key={platform.id}
                  className={`justify-start ${platform.buttonColor} text-white`}
                  onClick={() => handleConnectPlatform(platform.id)}
                  disabled={isLoading !== null}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span className="flex-1 text-left">
                    {isLoading === platform.id ? 
                      `Connexion à ${platform.name} en cours...` : 
                      `Se connecter avec ${platform.name}`}
                  </span>
                </Button>
              );
            })}
          </div>
          
          <div className="pt-2 text-xs text-muted-foreground">
            <p>En vous connectant, vous autorisez WimbiMaster à accéder aux données nécessaires pour gérer vos publications sur ces réseaux.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading !== null}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSocialAccountModal;
