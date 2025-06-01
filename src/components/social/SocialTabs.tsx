
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import SocialAccountList from '@/pages/dashboard/social/SocialAccountList';
import EmptyState from '@/pages/dashboard/social/EmptyState';
import ScheduledPostsList from '@/pages/dashboard/social/ScheduledPostsList';
import AnalyticsTab from '@/pages/dashboard/social/AnalyticsTab';
import { FirebaseSocialAccount } from '@/services/firebase/socialAccountsService';
import { ScheduledPost } from '@/context/AppContext';

interface SocialTabsProps {
  firebaseSocialAccounts: FirebaseSocialAccount[];
  scheduledPosts: ScheduledPost[];
  onAddAccount: () => void;
  onSchedulePost: () => void;
  onToggleConnection: (id: string, name: string, connected: boolean, platform: string) => void;
  onRemoveAccount: (id: string, name: string, platform: string) => void;
  onRemovePost: (id: string) => void;
}

const SocialTabs: React.FC<SocialTabsProps> = ({
  firebaseSocialAccounts,
  scheduledPosts,
  onAddAccount,
  onSchedulePost,
  onToggleConnection,
  onRemoveAccount,
  onRemovePost
}) => {
  // Transformer les comptes Firebase en format attendu par SocialAccountList
  const transformedAccounts = firebaseSocialAccounts.map(acc => ({
    id: acc.id,
    name: acc.platform.charAt(0).toUpperCase() + acc.platform.slice(1) as any,
    username: acc.username,
    connected: true,
    icon: acc.platform,
    color: getColorForPlatform(acc.platform)
  }));

  function getColorForPlatform(platform: string): string {
    switch (platform) {
      case 'facebook': return "bg-blue-600";
      case 'twitter': return "bg-sky-500";
      case 'instagram': return "bg-pink-600";
      case 'linkedin': return "bg-blue-700";
      default: return "bg-gray-500";
    }
  }

  const connectedPlatforms = firebaseSocialAccounts.map(acc => acc.platform);

  return (
    <Tabs defaultValue="accounts" className="space-y-4">
      <TabsList>
        <TabsTrigger value="accounts">Comptes connectés</TabsTrigger>
        <TabsTrigger value="scheduled">Publications planifiées</TabsTrigger>
        <TabsTrigger value="analytics">Statistiques</TabsTrigger>
      </TabsList>
      
      <TabsContent value="accounts" className="grid gap-4 md:grid-cols-2">
        {transformedAccounts.length > 0 ? (
          <SocialAccountList
            accounts={transformedAccounts}
            connectedAccounts={connectedPlatforms}
            onToggleConnection={onToggleConnection}
            onRemoveAccount={onRemoveAccount}
            onAddAccount={onAddAccount}
          />
        ) : null}
        
        <EmptyState 
          onAddAccount={onAddAccount} 
          hasAccounts={transformedAccounts.length > 0} 
          anyConnected={transformedAccounts.length > 0}
        />
      </TabsContent>
      
      <TabsContent value="scheduled">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>Publications planifiées</CardTitle>
              </div>
              <Button 
                onClick={onSchedulePost} 
                disabled={firebaseSocialAccounts.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Planifier une publication
              </Button>
            </div>
            <CardDescription>
              Gérez vos publications programmées sur tous vos réseaux sociaux
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduledPostsList 
              posts={scheduledPosts}
              onAddPost={onSchedulePost}
              onRemovePost={onRemovePost}
              socialAccountsConnected={firebaseSocialAccounts.length > 0}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="analytics">
        <AnalyticsTab />
      </TabsContent>
    </Tabs>
  );
};

export default SocialTabs;
