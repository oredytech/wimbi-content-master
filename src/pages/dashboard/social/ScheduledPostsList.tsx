
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Trash } from 'lucide-react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface ScheduledPostsListProps {
  posts: {
    id: string;
    content: string;
    date: string;
    platforms: string[];
  }[];
  onAddPost: () => void;
  onRemovePost: (id: string) => void;
  socialAccountsConnected: boolean;
}

const ScheduledPostsList: React.FC<ScheduledPostsListProps> = ({
  posts,
  onAddPost,
  onRemovePost,
  socialAccountsConnected
}) => {
  const getIconComponent = (name: string) => {
    switch (name) {
      case 'Facebook':
        return Facebook;
      case 'Twitter':
        return Twitter;
      case 'Instagram':
        return Instagram;
      case 'LinkedIn':
        return Linkedin;
      default:
        return Facebook;
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
        <h3 className="mt-2 text-lg font-medium">Aucune publication planifiée</h3>
        <p className="text-muted-foreground">Planifiez votre première publication sur les réseaux sociaux</p>
        <Button 
          className="mt-4" 
          onClick={onAddPost}
          disabled={!socialAccountsConnected}
        >
          <Plus className="mr-2 h-4 w-4" />
          Planifier une publication
        </Button>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
        <div className="col-span-5">Contenu</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-3">Plateformes</div>
        <div className="col-span-1"></div>
      </div>
      
      {posts.map((post) => (
        <div key={post.id} className="grid grid-cols-12 gap-4 p-4 border-t items-center">
          <div className="col-span-5 truncate">{post.content}</div>
          <div className="col-span-3 text-sm">
            {new Date(post.date).toLocaleString('fr-FR')}
          </div>
          <div className="col-span-3 flex gap-1">
            {post.platforms.map((platform) => {
              const Icon = getIconComponent(platform);
              let color = "";
              
              switch (platform) {
                case 'Facebook':
                  color = "text-blue-600";
                  break;
                case 'Twitter':
                  color = "text-sky-500";
                  break;
                case 'Instagram':
                  color = "text-pink-600";
                  break;
                case 'LinkedIn':
                  color = "text-blue-700";
                  break;
                default:
                  color = "text-gray-500";
              }
              
              return <Icon key={platform} className={`h-4 w-4 ${color}`} />;
            })}
          </div>
          <div className="col-span-1 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => onRemovePost(post.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduledPostsList;
