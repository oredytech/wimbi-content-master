
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Facebook, Linkedin, Twitter, Instagram, Wand2 } from 'lucide-react';

const NewContent = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // WordPress sites (in a real app, these would come from the user's connected sites)
  const wordpressSites = [
    { id: 1, name: 'Blog Principal', url: 'blog.example.com' },
    { id: 2, name: 'Site Professionnel', url: 'pro.example.com' },
    { id: 3, name: 'Site Perso', url: 'perso.example.com' },
  ];

  // Social networks (in a real app, these would be the user's connected accounts)
  const [selectedSites, setSelectedSites] = useState([1]); // Default: first site selected
  const [selectedSocials, setSelectedSocials] = useState({
    facebook: true,
    twitter: true,
    linkedin: false,
    instagram: false,
  });

  const handleGenerate = () => {
    if (!title) {
      toast({
        title: "Titre requis",
        description: "Veuillez saisir un titre pour générer du contenu.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI content generation
    setTimeout(() => {
      setContent(`# ${title}\n\nVoici un article généré sur le sujet "${title}".\n\nCet article pourrait contenir des informations pertinentes, des analyses approfondies et des conseils pratiques sur le sujet. Dans une vraie implémentation, ce contenu serait généré par une IA comme GPT-4 ou équivalent, avec la possibilité d'adapter le style, le ton et la longueur selon les préférences de l'utilisateur.\n\nLes principaux points abordés seraient:\n\n1. Introduction au sujet\n2. Analyse des tendances actuelles\n3. Conseils pratiques\n4. Conclusion et perspectives\n\nCe contenu serait ensuite paraphrasé intelligemment pour chaque site WordPress cible, afin d'éviter les problèmes de contenu dupliqué tout en préservant le message original.`);
      
      setIsGenerating(false);
      
      toast({
        title: "Contenu généré",
        description: "Le contenu a été généré avec succès! Vous pouvez maintenant le modifier avant publication.",
      });
    }, 2000);
  };

  const handleSiteToggle = (siteId: number) => {
    setSelectedSites((current) => 
      current.includes(siteId) 
        ? current.filter(id => id !== siteId)
        : [...current, siteId]
    );
  };

  const handleSocialToggle = (social: keyof typeof selectedSocials) => {
    setSelectedSocials((current) => ({
      ...current,
      [social]: !current[social],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez saisir un titre et un contenu avant de publier.",
        variant: "destructive",
      });
      return;
    }

    if (selectedSites.length === 0) {
      toast({
        title: "Aucun site sélectionné",
        description: "Veuillez sélectionner au moins un site WordPress pour la publication.",
        variant: "destructive",
      });
      return;
    }

    const socialCount = Object.values(selectedSocials).filter(Boolean).length;
    if (socialCount === 0) {
      toast({
        title: "Aucun réseau social sélectionné",
        description: "Veuillez sélectionner au moins un réseau social pour le partage.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate publication process
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Publication réussie!",
        description: `Votre contenu a été publié sur ${selectedSites.length} site(s) WordPress et ${socialCount} réseau(x) social(aux).`,
      });

      // Reset form or redirect to dashboard
      // In a real app, you might redirect to a success page or the content list
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouveau Contenu</h1>
        <p className="text-muted-foreground">Créez et publiez votre contenu sur plusieurs plateformes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Content Creation Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title">Titre</Label>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      toast({
                        title: "Génération de titre",
                        description: "Cette fonctionnalité sera disponible prochainement!",
                      });
                    }}
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    Générer un titre
                  </Button>
                </div>
                <Input
                  id="title"
                  placeholder="Entrez le titre de votre article"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Contenu</Label>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    {isGenerating ? "Génération en cours..." : "Générer du contenu"}
                  </Button>
                </div>
                <Textarea
                  id="content"
                  placeholder="Écrivez ou générez votre contenu ici..."
                  className="min-h-[300px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Settings */}
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="wordpress">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="wordpress">Sites WordPress</TabsTrigger>
                <TabsTrigger value="social">Réseaux Sociaux</TabsTrigger>
              </TabsList>
              
              <TabsContent value="wordpress" className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Sélectionnez les sites WordPress sur lesquels vous souhaitez publier ce contenu
                </p>

                <div className="space-y-2">
                  {wordpressSites.map((site) => (
                    <div key={site.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`site-${site.id}`} 
                        checked={selectedSites.includes(site.id)}
                        onCheckedChange={() => handleSiteToggle(site.id)}
                      />
                      <label
                        htmlFor={`site-${site.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {site.name} <span className="text-muted-foreground text-xs">({site.url})</span>
                      </label>
                    </div>
                  ))}
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    toast({
                      title: "Connexion de site",
                      description: "Cette fonctionnalité sera disponible prochainement!",
                    });
                  }}
                >
                  Connecter un nouveau site
                </Button>
              </TabsContent>
              
              <TabsContent value="social" className="space-y-6 pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Sélectionnez les réseaux sociaux sur lesquels vous souhaitez partager ce contenu
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Facebook */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="facebook" 
                        checked={selectedSocials.facebook}
                        onCheckedChange={() => handleSocialToggle('facebook')}
                      />
                      <label
                        htmlFor="facebook"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Facebook className="h-4 w-4 text-blue-600" />
                        Facebook
                      </label>
                    </div>
                    {selectedSocials.facebook && (
                      <div className="mt-3 pl-6">
                        <p className="text-xs text-muted-foreground mb-2">Format adapté pour Facebook:</p>
                        <p className="text-xs">• Post avec image et résumé engageant</p>
                        <p className="text-xs">• Ton conversationnel</p>
                      </div>
                    )}
                  </div>

                  {/* Twitter/X */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="twitter" 
                        checked={selectedSocials.twitter}
                        onCheckedChange={() => handleSocialToggle('twitter')}
                      />
                      <label
                        htmlFor="twitter"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Twitter className="h-4 w-4 text-blue-400" />
                        Twitter/X
                      </label>
                    </div>
                    {selectedSocials.twitter && (
                      <div className="mt-3 pl-6">
                        <p className="text-xs text-muted-foreground mb-2">Format adapté pour Twitter/X:</p>
                        <p className="text-xs">• Message concis avec hashtags pertinents</p>
                        <p className="text-xs">• Ton direct et accrocheur</p>
                      </div>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="linkedin" 
                        checked={selectedSocials.linkedin}
                        onCheckedChange={() => handleSocialToggle('linkedin')}
                      />
                      <label
                        htmlFor="linkedin"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Linkedin className="h-4 w-4 text-blue-800" />
                        LinkedIn
                      </label>
                    </div>
                    {selectedSocials.linkedin && (
                      <div className="mt-3 pl-6">
                        <p className="text-xs text-muted-foreground mb-2">Format adapté pour LinkedIn:</p>
                        <p className="text-xs">• Post professionnel avec résumé structuré</p>
                        <p className="text-xs">• Ton expert et informatif</p>
                      </div>
                    )}
                  </div>

                  {/* Instagram */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="instagram" 
                        checked={selectedSocials.instagram}
                        onCheckedChange={() => handleSocialToggle('instagram')}
                      />
                      <label
                        htmlFor="instagram"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Instagram className="h-4 w-4 text-pink-600" />
                        Instagram
                      </label>
                    </div>
                    {selectedSocials.instagram && (
                      <div className="mt-3 pl-6">
                        <p className="text-xs text-muted-foreground mb-2">Format adapté pour Instagram:</p>
                        <p className="text-xs">• Image visuelle avec légende comportant des hashtags</p>
                        <p className="text-xs">• Ton émotionnel et inspirant</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Publication en cours..." : "Publier maintenant"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewContent;
