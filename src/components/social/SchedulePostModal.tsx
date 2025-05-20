
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Twitter, Instagram, Linkedin, Upload, File, X, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SocialPost, SocialPublishingService } from "@/services/socialPublishingService";
import { SocialPlatform } from "@/config/socialConfig";

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

  const handleTogglePlatform = (platformName: SocialPlatform) => {
    setPlatforms(prev => 
      prev.includes(platformName)
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

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

  // Calculer la date minimum (aujourd'hui) pour le sélecteur de date
  const today = new Date().toISOString().split('T')[0];

  // Vérifier si la publication peut être publiée immédiatement
  const canPublishNow = platforms.length > 0 && content.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une publication</DialogTitle>
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
            {platforms.includes("twitter") && (
              <div className="flex justify-between text-xs">
                <span className={content.length > 280 ? "text-red-500" : "text-muted-foreground"}>
                  {content.length}/280 caractères
                </span>
                {content.length > 280 && (
                  <span className="text-red-500 font-medium">
                    Dépassement pour Twitter: {content.length - 280} caractères
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="post-link">Lien (optionnel)</Label>
            <Input
              id="post-link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com/article"
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Médias (optionnel)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="media-upload"
                type="file"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
                accept="image/*,video/*"
                multiple
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('media-upload')?.click()}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" /> Ajouter média
              </Button>
              {platforms.includes("instagram") && mediaFiles.length === 0 && (
                <span className="text-xs text-red-500">
                  Instagram nécessite au moins une image
                </span>
              )}
            </div>
            
            {mediaFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="border rounded-md p-2 flex items-center gap-2 bg-muted">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs truncate max-w-[100px]">{file.name}</span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="post-date">Date (optionnel)</Label>
              <Input
                id="post-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
                min={today}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="post-time">Heure (optionnel)</Label>
              <Input
                id="post-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          {(!date || !time) && (
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-800" />
              <AlertDescription>
                Sans date ni heure, la publication sera immédiate si vous cliquez sur "Publier maintenant".
              </AlertDescription>
            </Alert>
          )}
          
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
