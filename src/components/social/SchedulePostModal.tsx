
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addScheduledPost, socialAccounts } = useAppContext();

  const socialPlatforms = socialAccounts
    .filter(account => account.connected)
    .map(account => ({
      id: account.id,
      name: account.name,
      icon: account.name === "Facebook" ? Facebook :
            account.name === "Twitter" ? Twitter :
            account.name === "Instagram" ? Instagram :
            account.name === "LinkedIn" ? Linkedin : Facebook,
      color: account.color.replace('bg-', 'text-')
    }));

  const handleTogglePlatform = (platformName: string) => {
    setPlatforms(prev => 
      prev.includes(platformName)
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !date || !time || platforms.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs et sélectionner au moins une plateforme",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Créer une date complète à partir de la date et de l'heure
      const scheduledDateTime = new Date(`${date}T${time}`);
      
      // Vérifier si la date est dans le futur
      if (scheduledDateTime <= new Date()) {
        throw new Error("La date de publication doit être dans le futur");
      }

      // Dans une implémentation réelle, nous enverrions une requête à un serveur backend
      // qui stockerait cette tâche et l'exécuterait au moment voulu
      console.log("[Publication] Planification d'une publication pour:", scheduledDateTime);
      console.log("[Publication] Contenu:", content);
      console.log("[Publication] Plateformes:", platforms);
      
      // Pour l'instant, on simule une requête au serveur
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ajouter localement la publication planifiée
      addScheduledPost({
        content,
        date: scheduledDateTime.toISOString(),
        platforms,
      });

      toast({
        title: "Publication planifiée",
        description: `La publication a été planifiée pour le ${new Date(scheduledDateTime).toLocaleDateString('fr-FR')} à ${new Date(scheduledDateTime).toLocaleTimeString('fr-FR')}`,
      });
      
      // Réinitialiser le formulaire et fermer la modale
      setContent("");
      setDate("");
      setTime("");
      setPlatforms([]);
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de planifier la publication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer la date minimum (aujourd'hui) pour le sélecteur de date
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Planifier une publication</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="post-content">Contenu</Label>
            <Textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Rédigez votre publication..."
              className="min-h-[100px]"
              disabled={isLoading}
              required
            />
            {platforms.includes("Twitter") && content.length > 280 && (
              <p className="text-xs text-red-500">
                Attention: Votre message dépasse la limite de 280 caractères pour Twitter
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="post-date">Date</Label>
              <Input
                id="post-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
                min={today}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="post-time">Heure</Label>
              <Input
                id="post-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Plateformes</Label>
            {socialPlatforms.length > 0 ? (
              <div className="grid gap-2">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`platform-${platform.id}`}
                        checked={platforms.includes(platform.name)}
                        onCheckedChange={() => handleTogglePlatform(platform.name)}
                        disabled={isLoading}
                      />
                      <Label 
                        htmlFor={`platform-${platform.id}`}
                        className="flex items-center cursor-pointer"
                      >
                        <Icon className={`h-4 w-4 mr-2 ${platform.color}`} />
                        <span>{platform.name}</span>
                      </Label>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun réseau social connecté. Connectez des comptes pour pouvoir publier.
              </p>
            )}
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || socialPlatforms.length === 0}
            >
              {isLoading ? "Planification en cours..." : "Planifier la publication"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulePostModal;
