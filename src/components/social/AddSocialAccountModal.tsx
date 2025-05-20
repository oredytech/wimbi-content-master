
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";

interface AddSocialAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSocialAccountModal: React.FC<AddSocialAccountModalProps> = ({ isOpen, onClose }) => {
  const [socialType, setSocialType] = useState<"Facebook" | "Twitter" | "Instagram" | "LinkedIn" | "">("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addSocialAccount } = useAppContext();

  const socialPlatforms = [
    { name: "Facebook", color: "bg-blue-600" },
    { name: "Twitter", color: "bg-sky-500" },
    { name: "Instagram", color: "bg-pink-600" },
    { name: "LinkedIn", color: "bg-blue-700" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!socialType || !username.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Simuler une API call pour connecter le réseau social
      await new Promise(resolve => setTimeout(resolve, 1500));

      const platform = socialPlatforms.find(p => p.name === socialType);
      
      if (!platform) {
        throw new Error("Plateforme non prise en charge");
      }

      // Ajouter le compte de réseau social
      addSocialAccount({
        name: socialType as any,
        username,
        connected: true,
        icon: socialType,
        color: platform.color,
      });

      toast({
        title: "Compte ajouté",
        description: `Le compte ${socialType} a été connecté avec succès`,
      });
      
      // Réinitialiser le formulaire et fermer la modale
      setSocialType("");
      setUsername("");
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de connecter le compte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un réseau social</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="social-type">Plateforme</Label>
            <Select 
              value={socialType} 
              onValueChange={(value) => setSocialType(value as any)}
              disabled={isLoading}
            >
              <SelectTrigger id="social-type">
                <SelectValue placeholder="Sélectionnez une plateforme" />
              </SelectTrigger>
              <SelectContent>
                {socialPlatforms.map((platform) => (
                  <SelectItem key={platform.name} value={platform.name}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={
                socialType === "Facebook" ? "entreprise.page" :
                socialType === "Twitter" ? "@entreprise" :
                socialType === "Instagram" ? "@entreprise" :
                socialType === "LinkedIn" ? "Nom de l'entreprise" :
                "Nom d'utilisateur"
              }
              disabled={isLoading}
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !socialType}>
              {isLoading ? "Connexion en cours..." : "Connecter le compte"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSocialAccountModal;
