
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin, Upload, File, X } from "lucide-react";
import { SocialPlatform } from "@/config/socialConfig";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface PostFormProps {
  content: string;
  setContent: (content: string) => void;
  link: string;
  setLink: (link: string) => void;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  platforms: SocialPlatform[];
  setPlatforms: (platforms: SocialPlatform[]) => void;
  mediaFiles: File[];
  setMediaFiles: (files: File[]) => void;
  isLoading: boolean;
  socialPlatforms: {
    id: string;
    name: SocialPlatform;
    icon: React.ElementType;
    color: string;
  }[];
}

const PostForm: React.FC<PostFormProps> = ({
  content,
  setContent,
  link,
  setLink,
  date,
  setDate,
  time,
  setTime,
  platforms,
  setPlatforms,
  mediaFiles,
  setMediaFiles,
  isLoading,
  socialPlatforms,
}) => {
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

  // Calculer la date minimum (aujourd'hui) pour le sélecteur de date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4 py-4">
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
          <button 
            type="button" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            onClick={() => document.getElementById('media-upload')?.click()}
            disabled={isLoading}
          >
            <Upload className="h-4 w-4 mr-2" /> Ajouter média
          </button>
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
    </div>
  );
};

export default PostForm;
