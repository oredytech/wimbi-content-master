
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';

const Features = () => {
  const features = [
    {
      title: "Publication multiplateforme",
      description: "Publiez vos contenus simultanément sur plusieurs blogs WordPress et réseaux sociaux.",
      icon: "🌐",
      details: "Connectez tous vos sites WordPress et réseaux sociaux pour publier en un clic. Économisez des heures de travail chaque semaine."
    },
    {
      title: "Adaptation IA du contenu",
      description: "Notre IA adapte automatiquement votre contenu pour chaque plateforme.",
      icon: "🤖",
      details: "L'IA reformate et optimise votre contenu pour chaque plateforme, en respectant les spécificités de chacune (longueur, hashtags, images)."
    },
    {
      title: "Planification avancée",
      description: "Planifiez vos publications aux moments optimaux pour maximiser l'engagement.",
      icon: "📅",
      details: "Analysez les meilleurs moments de publication et planifiez vos contenus à l'avance grâce à notre calendrier éditorial intelligent."
    },
    {
      title: "Analyses détaillées",
      description: "Suivez les performances de vos contenus sur toutes les plateformes dans un tableau de bord unifié.",
      icon: "📊",
      details: "Mesurez l'engagement, les conversions et le ROI de vos contenus grâce à nos tableaux de bord analytiques personnalisables."
    },
    {
      title: "Collaboration d'équipe",
      description: "Travaillez en équipe sur vos contenus avec des outils de collaboration intégrés.",
      icon: "👥",
      details: "Assignez des rôles, gérez les workflows et communiquez directement au sein de l'application pour une collaboration fluide."
    },
    {
      title: "SEO automatisé",
      description: "Optimisez automatiquement vos contenus pour les moteurs de recherche.",
      icon: "🔍",
      details: "Notre moteur SEO analyse et suggère des améliorations pour optimiser vos contenus et maximiser leur visibilité."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Fonctionnalités puissantes pour les créateurs de contenu
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Wimbi Master vous offre tous les outils nécessaires pour créer, publier et gérer votre contenu sur toutes les plateformes, en un seul endroit.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/signup">Commencer gratuitement</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/pricing">Voir les plans</Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <Card className="border transition-all duration-300 hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{feature.title}</h4>
                <p className="text-sm">{feature.details}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-wimbi/10 rounded-xl p-8 md:p-12 text-center mt-16">
        <h2 className="text-3xl font-bold mb-4">Prêt à optimiser votre stratégie de contenu?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Rejoignez des milliers de créateurs de contenu qui utilisent Wimbi Master pour publier plus efficacement.
        </p>
        <Button size="lg" asChild>
          <Link to="/signup" className="flex items-center gap-2">
            Essayer gratuitement <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Benefits Section */}
      <div className="py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Wimbi Master?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[
              "Économisez jusqu'à 10 heures par semaine sur la gestion de contenu",
              "Augmentez votre portée en publiant sur toutes les plateformes",
              "Améliorez l'engagement grâce à la personnalisation IA",
              "Obtenez des analyses détaillées pour optimiser votre stratégie"
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-wimbi flex-shrink-0 mt-0.5" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {[
              "Centralisez tous vos contenus dans une seule plateforme",
              "Simplifiez la collaboration entre les membres de votre équipe",
              "Réduisez les erreurs et incohérences entre les plateformes",
              "Gagnez en efficacité et en productivité au quotidien"
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-wimbi flex-shrink-0 mt-0.5" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
