import React from 'react';
import { formatDate } from '../utils/dateUtils';
import { GP } from '../types';
import Card, { CardContent, CardHeader } from './ui/Card';
import Button from './ui/Button';
import { Trophy, Flag } from 'lucide-react';

interface RaceCardProps {
  race: GP;
  onPlaceBet?: (raceId: string) => void;
}

const RaceCard: React.FC<RaceCardProps> = ({ race, onPlaceBet }) => {
  const { id_api_races, date, time, track } = race;
  const formattedDate = formatDate(date);
  const isPastRace = new Date(`${date}T${time}`) < new Date();
  
  // Default track image if none provided
  const trackImage = track.picture_track || 
    `https://images.pexels.com/photos/12771905/pexels-photo-12771905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`;
  
  // Default flag image if none provided
  const flagImage = track.picture_country ||
    `https://images.pexels.com/photos/4151028/pexels-photo-4151028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`;

  return (
    <Card hover className="h-full">
      <div className="relative">
        <img 
          src={trackImage} 
          alt={`${track.track_name} circuit`} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 bg-accent-950 bg-opacity-70 rounded-md px-3 py-1 flex items-center">
          <img 
            src={flagImage}
            alt={track.country_name} 
            className="w-6 h-4 mr-2 object-cover" 
          />
          <span className="font-racing font-bold">{track.country_name}</span>
        </div>
      </div>
      
      <CardHeader className="flex justify-between items-center bg-accent-950">
        <h3 className="font-racing font-bold text-lg">{track.track_name}</h3>
        <span className="text-sm text-accent-400">{formattedDate}</span>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Flag size={16} className="text-primary-500" />
            <span className="text-sm">Grand Prix</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-secondary-500" />
            <span className="text-sm">Race {id_api_races.split('-').pop()}</span>
          </div>
        </div>
        
        {isPastRace ? (
          <Button 
            variant="outline" 
            fullWidth
          >
            View Results
          </Button>
        ) : (
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => onPlaceBet && onPlaceBet(id_api_races)}
          >
            Place Bet
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RaceCard;