
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Share2, FileText, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 hero-gradient overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                <span className="gradient-text">Un contenu,</span> <br />
                plusieurs plateformes.
              </h1>
              <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-xl">
                Publiez simultanément sur plusieurs sites WordPress et réseaux sociaux, 
                avec une adaptation intelligente de votre contenu par IA.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="text-base">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button variant="outline" size="lg" className="text-base">
                    Voir une démo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-video max-w-xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-wimbi to-wimbi-accent rounded-xl shadow-xl opacity-20 animate-float"></div>
                <div className="absolute inset-0 bg-white rounded-xl shadow-xl -translate-y-4 -translate-x-4"></div>
                <div className="absolute inset-0 bg-white rounded-xl shadow-xl translate-y-8 translate-x-8 border"></div>
                <div className="absolute inset-0 bg-white rounded-xl shadow-xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <FileText size={64} className="mx-auto mb-4 text-wimbi" />
                      <div className="bg-gray-100 h-4 w-3/4 mx-auto mb-3 rounded-full"></div>
                      <div className="bg-gray-100 h-3 w-full mx-auto mb-2 rounded-full"></div>
                      <div className="bg-gray-100 h-3 w-5/6 mx-auto mb-2 rounded-full"></div>
                      <div className="bg-gray-100 h-3 w-full mx-auto rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/4 -right-12 bg-white p-3 rounded-lg shadow-lg border animate-float z-10 hidden md:block">
                <Globe size={24} className="text-wimbi" />
              </div>
              <div className="absolute bottom-0 -left-8 bg-white p-3 rounded-lg shadow-lg border animate-float z-10 hidden md:block" style={{ animationDelay: '2s' }}>
                <Share2 size={24} className="text-wimbi-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce qu'il faut pour maximiser votre portée</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Wimbi Master combine des outils puissants pour vous aider à diffuser votre contenu 
              de manière optimale sur toutes vos plateformes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-wimbi/10 w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-wimbi" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Publication Multi-WordPress</h3>
                <p className="text-gray-600">
                  Publiez simultanément sur tous vos sites WordPress avec une seule action, en préservant votre mise en forme.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-wimbi-accent/10 w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-wimbi-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">IA de Paraphrase</h3>
                <p className="text-gray-600">
                  Adaptez automatiquement votre contenu pour éviter la pénalisation de contenu dupliqué, sans perdre le sens original.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="bg-wimbi/10 w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                  <Share2 className="h-8 w-8 text-wimbi" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Partage Social Intelligent</h3>
                <p className="text-gray-600">
                  Générez des résumés adaptés à chaque réseau social, avec le ton et le format optimaux pour maximiser l'engagement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça fonctionne</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Un processus simple en trois étapes pour diffuser votre contenu efficacement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-wimbi/10 w-20 h-20 rounded-full mb-6 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-wimbi">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Créez votre contenu</h3>
              <p className="text-gray-600">
                Utilisez notre éditeur intuitif ou importez depuis vos outils préférés comme Google Docs ou Notion.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-wimbi/10 w-20 h-20 rounded-full mb-6 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-wimbi">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Personnalisez la diffusion</h3>
              <p className="text-gray-600">
                Choisissez vos sites WordPress et réseaux sociaux cibles, avec des options de personnalisation pour chaque plateforme.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-wimbi/10 w-20 h-20 rounded-full mb-6 flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-wimbi">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Publiez en un clic</h3>
              <p className="text-gray-600">
                Notre IA optimise et adapte votre contenu pour chaque destination avant de le publier instantanément.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-wimbi to-wimbi-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à transformer votre stratégie de contenu?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Rejoignez les créateurs de contenus qui économisent du temps et augmentent leur portée grâce à Wimbi Master.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-wimbi text-base">
              Commencer votre essai gratuit
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
