import React from 'react';
import { League } from '../types';
import Card, { CardContent, CardHeader, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { Trophy, Users, Lock, Unlock, Copy } from 'lucide-react';

interface LeagueCardProps {
  league: League;
  onJoin?: (leagueId: number) => void;
  onViewResults?: (leagueId: number) => void;
  showInviteLink?: boolean;
}

const LeagueCard: React.FC<LeagueCardProps> = ({ 
  league, 
  onJoin, 
  onViewResults,
  showInviteLink
}) => {
  const { id, name, private: isPrivate, shared_link, membersCount } = league;

  const avatarUrl = league.avatar?.picture_avatar || 
    `https://images.pexels.com/photos/4194860/pexels-photo-4194860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shared_link) {
      navigator.clipboard.writeText(shared_link);
      alert('Lien d’invitation copié !');
    }
  };

  return (
    <Card hover className="h-full">
      <CardHeader className="flex items-center gap-4 bg-accent-950">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-accent-800">
          <img 
            src={avatarUrl} 
            alt={`Avatar de ${name}`} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1">
          <h3 
            className="font-racing font-bold text-lg truncate" 
            title={name}
          >
            {name}
          </h3>
          <div className="flex items-center text-sm text-accent-400">
            {isPrivate ? (
              <><Lock size={14} className="mr-1" /> Privée</>
            ) : (
              <><Unlock size={14} className="mr-1" /> Publique</>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-secondary-500" />
            <span className="text-sm">
              {membersCount !== undefined ? `${membersCount} membres` : 'Membres'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-primary-500" />
            <span className="text-sm">Classement</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          fullWidth
          onClick={() => onViewResults?.(id)}
          disabled={!onViewResults}
        >
          Voir classement
        </Button>

        {shared_link && (
          <Button 
            variant="primary" 
            size="sm"
            fullWidth
            onClick={handleCopyLink}
          >
            <Copy size={14} className="mr-1" />
            Copier le lien
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LeagueCard;
