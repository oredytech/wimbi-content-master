
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { connectWordPressSite } from "@/services/oauthService";

interface AddWordPressSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWordPressSiteModal: React.FC<AddWordPressSiteModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addWordPressSite } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim() || !username.trim() || !password.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Utiliser le service de connexion WordPress réel
      const result = await connectWordPressSite(url, username, password);
      
      if (!result.success || !result.siteInfo) {
        throw new Error(result.error || "Échec de la connexion au site WordPress");
      }
      
      // Ajouter le site WordPress
      addWordPressSite({
        name: result.siteInfo.name,
        url: result.siteInfo.url,
        status: result.siteInfo.status,
        posts: result.siteInfo.posts,
        lastSync: result.siteInfo.lastSync,
      });

      toast({
        title: "Site connecté",
        description: `Le site ${result.siteInfo.name} a été connecté avec succès`,
      });
      
      // Réinitialiser le formulaire et fermer la modale
      setUrl("");
      setUsername("");
      setPassword("");
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
            <Label htmlFor="site-url">URL du site</Label>
            <Input
              id="site-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://votre-site.com"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="site-username">Nom d'utilisateur</Label>
            <Input
              id="site-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="site-password">Mot de passe ou Clé d'application</Label>
            <Input
              id="site-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              Nous vous recommandons d'utiliser une <a href="https://make.wordpress.org/core/2020/11/05/application-passwords-integration-in-wordpress-5-6/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">clé d'application</a> plutôt qu'un mot de passe administrateur.
            </p>
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
