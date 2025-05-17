
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        title: "Veuillez accepter les conditions d'utilisation",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    // Simulate signup process
    setTimeout(() => {
      if (name && email && password) {
        localStorage.setItem('wimbiUser', JSON.stringify({ name, email }));
        toast({
          title: "Compte créé avec succès",
          description: "Bienvenue sur Wimbi Master!",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Erreur d'inscription",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold gradient-text">Wimbi Master</h1>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Créer un compte</CardTitle>
            <CardDescription>
              Commencez votre essai gratuit de 14 jours
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="8+ caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms} 
                  onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  J'accepte les{' '}
                  <Link to="/terms" className="text-wimbi hover:underline">
                    Conditions d'utilisation
                  </Link>
                  {' '}et la{' '}
                  <Link to="/privacy" className="text-wimbi hover:underline">
                    Politique de confidentialité
                  </Link>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "Créer un compte"}
              </Button>
              <div className="text-sm text-center">
                Déjà un compte?{' '}
                <Link to="/login" className="text-wimbi hover:underline">
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
