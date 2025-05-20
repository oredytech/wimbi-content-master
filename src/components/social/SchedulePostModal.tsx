
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { SocialPost, SocialPublishingService } from '@/services/socialPublishingService';
import { SocialPlatform } from '@/config/socialConfig';
import PostForm from "./PostForm";

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const { addScheduledPost, socialAccounts } = useAppContext();

  const socialPlatforms = socialAccounts
    .filter(account => account.connected)
    .map(account => ({
      id: account.id,
      name: account.name as SocialPlatform,
      icon: account.name === "Facebook" ? Facebook :
            account.name === "Twitter" ? Twitter :
            account.name === "Instagram" ? Instagram :
            account.name === "LinkedIn" ? Linkedin : Facebook,
      color: account.color.replace('bg-', 'text-')
    }));

  const validateForm = (): boolean => {
    if (!content.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez rédiger le contenu de votre publication.",
        variant: "destructive",
      });
      return false;
    }

    if (platforms.length === 0) {
      toast({
        title: "Plateforme requise",
        description: "Veuillez sélectionner au moins une plateforme pour la publication.",
        variant: "destructive",
      });
      return false;
    }

    if (platforms.includes("twitter") && content.length > 280) {
      toast({
        title: "Contenu trop long",
        description: "Le contenu dépasse la limite de 280 caractères pour Twitter.",
        variant: "destructive",
      });
      return false;
    }

    if (platforms.includes("instagram") && mediaFiles.length === 0) {
      toast({
        title: "Image requise",
        description: "Une publication Instagram nécessite au moins une image.",
        variant: "destructive",
      });
      return false;
    }

    // Vérifier la date si elle est spécifiée
    if (date && time) {
      const scheduledDateTime = new Date(`${date}T${time}`);
      if (scheduledDateTime <= new Date()) {
        toast({
          title: "Date invalide",
          description: "La date de publication doit être dans le futur.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Préparer les données de publication
      const post: SocialPost = {
        content,
        platforms: platforms.map(p => p.toLowerCase() as SocialPlatform),
        link: link || undefined,
        mediaUrls: mediaFiles.length > 0 
          ? mediaFiles.map(file => URL.createObjectURL(file)) 
          : undefined
      };

      // Créer une date complète si date et heure sont spécifiées
      let scheduledDateTime: Date | undefined;
      if (date && time) {
        scheduledDateTime = new Date(`${date}T${time}`);
        post.scheduledDate = scheduledDateTime;
      }

      console.log("[Publication] Préparation de la publication:", post);
      
      if (scheduledDateTime && scheduledDateTime > new Date()) {
        // Planifier la publication pour plus tard
        console.log("[Publication] Planification pour:", scheduledDateTime.toISOString());
        
        // Ajouter localement la publication planifiée
        addScheduledPost({
          content,
          date: scheduledDateTime.toISOString(),
          platforms: platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)),
        });

        toast({
          title: "Publication planifiée",
          description: `La publication a été planifiée pour le ${scheduledDateTime.toLocaleDateString('fr-FR')} à ${scheduledDateTime.toLocaleTimeString('fr-FR')}`,
        });
      } else {
        // Publier immédiatement
        console.log("[Publication] Publication immédiate");
        const results = await SocialPublishingService.publishToSocialMedia(post);
        
        // Analyser les résultats
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        if (successful.length > 0) {
          toast({
            title: "Publication réussie",
            description: `Publié avec succès sur ${successful.length} plateforme(s)`,
          });
        }
        
        if (failed.length > 0) {
          toast({
            title: "Problèmes de publication",
            description: `Échec sur ${failed.length} plateforme(s). Vérifiez les détails.`,
            variant: "destructive",
          });
          console.error("[Publication] Échecs:", failed);
        }
      }
      
      // Réinitialiser le formulaire et fermer la modale
      setContent("");
      setLink("");
      setDate("");
      setTime("");
      setPlatforms([]);
      setMediaFiles([]);
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de planifier la publication",
        variant: "destructive",
      });
      console.error("[Publication] Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier si la publication peut être publiée immédiatement
  const canPublishNow = platforms.length > 0 && content.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une publication</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <PostForm
            content={content}
            setContent={setContent}
            link={link}
            setLink={setLink}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            platforms={platforms}
            setPlatforms={setPlatforms}
            mediaFiles={mediaFiles}
            setMediaFiles={setMediaFiles}
            isLoading={isLoading}
            socialPlatforms={socialPlatforms}
          />
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            {date && time ? (
              <Button 
                type="submit" 
                disabled={isLoading || socialPlatforms.length === 0 || !content.trim()}
              >
                {isLoading ? "Planification en cours..." : "Planifier la publication"}
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isLoading || !canPublishNow}
              >
                {isLoading ? "Publication en cours..." : "Publier maintenant"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulePostModal;
