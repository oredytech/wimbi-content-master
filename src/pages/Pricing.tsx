
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState("yearly");
  
  const plans = [
    {
      name: "Basic",
      description: "Idéal pour les créateurs individuels",
      monthlyPrice: 9.99,
      yearlyPrice: 99,
      features: [
        "3 sites WordPress",
        "2 réseaux sociaux",
        "10 publications par mois",
        "Adaptation IA basique",
        "Analyses standard",
        "Stockage de 5GB"
      ],
      highlight: false,
      cta: "Essayer gratuitement"
    },
    {
      name: "Pro",
      description: "Pour les professionnels du contenu",
      monthlyPrice: 24.99,
      yearlyPrice: 249,
      features: [
        "10 sites WordPress",
        "5 réseaux sociaux",
        "100 publications par mois",
        "Adaptation IA avancée",
        "Analyses détaillées",
        "Stockage de 20GB",
        "SEO Automatisé",
        "Collaboration jusqu'à 3 membres"
      ],
      highlight: true,
      cta: "Commencer avec Pro"
    },
    {
      name: "Business",
      description: "Solution complète pour les équipes",
      monthlyPrice: 49.99,
      yearlyPrice: 499,
      features: [
        "Sites WordPress illimités",
        "Réseaux sociaux illimités",
        "Publications illimitées",
        "Adaptation IA premium",
        "Analyses avancées & rapports",
        "Stockage de 100GB",
        "SEO Automatisé premium",
        "Collaboration illimitée",
        "Support prioritaire"
      ],
      highlight: false,
      cta: "Contacter les ventes"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Tarification simple et transparente
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Choisissez le plan qui correspond à vos besoins. Tous nos plans incluent un essai gratuit de 14 jours.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <Tabs defaultValue="yearly" onValueChange={(value) => setBillingPeriod(value)} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Mensuel</TabsTrigger>
            <TabsTrigger value="yearly">
              <span>Annuel</span>
              <span className="ml-2 rounded-full bg-green-100 text-green-800 text-xs px-2 py-0.5">-20%</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {plans.map((plan, index) => (
          <Card key={index} className={`border ${plan.highlight ? 'border-wimbi shadow-lg relative overflow-hidden' : ''}`}>
            {plan.highlight && (
              <div className="absolute top-0 right-0">
                <div className="bg-wimbi text-white text-xs font-bold px-3 py-1 uppercase transform translate-x-1/4 rotate-45 origin-bottom-left shadow-sm">
                  Populaire
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold">
                  {billingPeriod === "yearly" ? `${plan.yearlyPrice}€` : `${plan.monthlyPrice}€`}
                </span>
                <span className="text-muted-foreground">
                  /{billingPeriod === "yearly" ? "an" : "mois"}
                </span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-wimbi flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant={plan.highlight ? "default" : "outline"} className={`w-full ${plan.highlight ? '' : 'hover:border-wimbi hover:text-wimbi'}`} asChild>
                <Link to="/signup">{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Questions fréquentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Puis-je changer de plan à tout moment ?</h3>
            <p className="text-muted-foreground">Oui, vous pouvez modifier votre abonnement à tout moment. Les ajustements au prorata seront appliqués à votre cycle de facturation.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Comment fonctionne l'essai gratuit ?</h3>
            <p className="text-muted-foreground">Tous nos plans incluent un essai gratuit de 14 jours. Aucune carte de crédit n'est requise pour commencer. Vous ne serez facturé qu'à la fin de votre période d'essai.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Y a-t-il des frais cachés ?</h3>
            <p className="text-muted-foreground">Non, notre tarification est complètement transparente. Il n'y a aucun frais supplémentaire ou caché. Ce que vous voyez est ce que vous payez.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Puis-je annuler à tout moment ?</h3>
            <p className="text-muted-foreground">Oui, vous pouvez annuler votre abonnement à tout moment. Si vous annulez, vous aurez accès au service jusqu'à la fin de votre cycle de facturation actuel.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Offrez-vous une réduction pour les ONG ou les établissements d'enseignement ?</h3>
            <p className="text-muted-foreground">Oui, nous proposons des tarifs spéciaux pour les organisations à but non lucratif et les institutions éducatives. Contactez notre équipe commerciale pour plus d'informations.</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-4">Besoin d'une solution sur mesure ?</h2>
        <p className="text-muted-foreground mb-6">Contactez-nous pour discuter de vos besoins spécifiques.</p>
        <Button variant="outline" size="lg" asChild>
          <Link to="/contact">Contacter les ventes</Link>
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
