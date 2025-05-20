
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const AnalyticsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques des réseaux sociaux</CardTitle>
        <CardDescription>
          Suivez les performances de vos publications sur les réseaux sociaux
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full bg-muted/50 p-6 mx-auto w-fit">
            <Settings className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Module statistiques</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Le module d'analyse des statistiques sera disponible prochainement
          </p>
          <Button className="mt-4" variant="outline">
            Être notifié
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
