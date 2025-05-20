
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: "Sophie Martin",
      role: "CEO & Co-fondatrice",
      bio: "Ancienne responsable marketing chez un grand éditeur de contenu. A fondé Wimbi Master après avoir identifié le besoin d'une solution centralisée pour les créateurs.",
      image: "https://placehold.co/600x600/e2e8f0/1e293b?text=SM"
    },
    {
      name: "Thomas Dubois",
      role: "CTO & Co-fondateur",
      bio: "Expert en IA et développement web avec 15 ans d'expérience. Passionné par l'automatisation et l'optimisation des workflows de contenu.",
      image: "https://placehold.co/600x600/e2e8f0/1e293b?text=TD"
    },
    {
      name: "Emma Lefèvre",
      role: "Directrice Produit",
      bio: "Ancienne consultante en stratégie digitale et créatrice de contenu. Comprend intimement les défis des utilisateurs.",
      image: "https://placehold.co/600x600/e2e8f0/1e293b?text=EL"
    },
    {
      name: "Lucas Bernard",
      role: "Lead Développeur",
      bio: "Développeur full-stack spécialisé dans les CMS et les API de réseaux sociaux. Contributeur actif à l'écosystème WordPress.",
      image: "https://placehold.co/600x600/e2e8f0/1e293b?text=LB"
    }
  ];

  const values = [
    {
      title: "Simplicité",
      description: "Nous croyons que la technologie doit simplifier la vie, pas la compliquer. Notre interface est conçue pour être intuitive et accessible à tous."
    },
    {
      title: "Innovation",
      description: "Nous repoussons constamment les limites de ce qui est possible avec l'IA et l'automatisation pour offrir des solutions toujours plus performantes."
    },
    {
      title: "Fiabilité",
      description: "Nous comprenons que les créateurs de contenu comptent sur notre plateforme pour leur activité quotidienne. La stabilité est notre priorité."
    },
    {
      title: "Transparence",
      description: "Nous croyons en une communication ouverte et honnête avec nos utilisateurs, que ce soit pour les fonctionnalités ou la tarification."
    }
  ];

  const milestones = [
    { year: "2022", event: "Fondation de Wimbi Master par Sophie Martin et Thomas Dubois" },
    { year: "2023", event: "Lancement de la version bêta et premiers utilisateurs" },
    { year: "2023", event: "Levée de fonds de série A (2,5M€)" },
    { year: "2024", event: "Lancement officiel de la plateforme" },
    { year: "2024", event: "Atteinte de 10 000 utilisateurs actifs" },
    { year: "2025", event: "Expansion internationale et nouvelles fonctionnalités IA" }
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Notre mission
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Chez Wimbi Master, nous simplifions la vie des créateurs de contenu en leur offrant une plateforme centralisée pour gérer et optimiser leur présence en ligne.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-3xl font-bold mb-6">Notre histoire</h2>
          <div className="space-y-4 text-lg">
            <p>
              Wimbi Master est né d'une frustration partagée par de nombreux créateurs de contenu : la complexité et le temps nécessaire pour gérer plusieurs plateformes simultanément.
            </p>
            <p>
              En 2022, Sophie Martin et Thomas Dubois ont uni leurs expertises complémentaires pour créer une solution qui permettrait aux créateurs de se concentrer sur ce qu'ils font de mieux : créer du contenu de qualité.
            </p>
            <p>
              Après des mois de développement et une phase bêta intensive avec des créateurs passionnés, Wimbi Master a officiellement été lancé en 2024, révolutionnant la façon dont les professionnels gèrent leur contenu en ligne.
            </p>
          </div>
        </div>
        <div className="bg-muted/30 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Notre parcours</h3>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4">
                <div className="text-wimbi font-bold w-16">{milestone.year}</div>
                <div>{milestone.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="border hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Notre équipe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-wimbi mb-2">{member.role}</p>
              <Collapsible>
                <CollapsibleTrigger className="text-sm text-muted-foreground flex items-center mx-auto">
                  Bio <ChevronDown className="h-4 w-4 ml-1" />
                </CollapsibleTrigger>
                <CollapsibleContent className="text-sm mt-2">
                  {member.bio}
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-wimbi/10 rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Rejoignez l'aventure Wimbi Master</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Découvrez comment notre plateforme peut transformer votre processus de création de contenu.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/signup">Essayer gratuitement</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
