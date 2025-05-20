
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";

interface AddWordPressSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWordPressSiteModal: React.FC<AddWordPressSiteModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addWordPressSite } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Vérifier si l'URL est valide
      if (!url.startsWith("http")) {
        throw new Error("L'URL doit commencer par http:// ou https://");
      }
      
      // Simuler une API call pour connecter le site
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Ajouter le site WordPress
      addWordPressSite({
        name,
        url,
        status: "connected",
        posts: 0,
        lastSync: new Date().toISOString()
      });

      toast({
        title: "Site ajouté",
        description: `Le site ${name} a été connecté avec succès`,
      });
      
      // Réinitialiser le formulaire et fermer la modale
      setName("");
      setUrl("");
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de connecter le site WordPress",
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
          <DialogTitle>Connecter un site WordPress</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="site-name">Nom du site</Label>
            <Input
              id="site-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon Blog"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="site-url">URL du site</Label>
            <Input
              id="site-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://mon-blog.com"
              disabled={isLoading}
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Connecter le site"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWordPressSiteModal;
