import React, { useState } from 'react';
import { formatDate } from '../utils/dateUtils';
import { GP } from '../types';
import Card, { CardContent, CardHeader } from './ui/Card';
import Button from './ui/Button';
import { Trophy, Flag, Users } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_GP_PILOTES } from '../graphql/queries';
import Modal from './ui/Modal'; 

interface RaceCardProps {
  race: GP;
  onPlaceBet?: (raceId: string) => void;
}

const RaceCard: React.FC<RaceCardProps> = ({ race, onPlaceBet }) => {
  const { id_api_races, date, time, track } = race;
  const formattedDate = formatDate(date);
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  const isPastRace = date < formattedToday;

  const [showPilotes, setShowPilotes] = useState(false);

  const { data: pilotesData, loading: loadingPilotes } = useQuery(GET_GP_PILOTES, {
    variables: { gpId: id_api_races },
    skip: !showPilotes,
  });

  const trackImage = track.picture_track ||
    `https://media.npr.org/assets/img/2023/11/18/gettyimages-1800093928-a35232af995d98d6856e71add88fc72ee06d112d.jpg?s=900&c=85&f=webp`;

  const flagImage = track.picture_country ||
    `https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Flag_of_Monaco.svg/langfr-500px-Flag_of_Monaco.svg.png`;

  return (
    <Card hover className="h-full">
      <div className="relative">
        <img
          src={trackImage}
          alt={`Circuit ${track.track_name}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 bg-accent-950 bg-opacity-70 rounded-md px-3 py-1 flex items-center">
          <img
            src={flagImage}
            alt={`Drapeau ${track.country_name}`}
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
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={isPastRace ? 'outline' : 'primary'}
            fullWidth
            disabled={isPastRace}
            onClick={() => !isPastRace && onPlaceBet?.(id_api_races)}
          >
            {isPastRace ? 'Pari fermé' : 'Parier'}
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowPilotes(true)}
          >
            Pilotes
          </Button>
        </div>
      </CardContent>

      {showPilotes && (
        <Modal title="Pilotes participants" onClose={() => setShowPilotes(false)}>
          {loadingPilotes ? (
            <p className="text-accent-400">Chargement...</p>
          ) : (
            <ul className="text-white space-y-1">
              {pilotesData?.getPilotesByGP.map((p: any) => (
                <li key={p.id_api_pilotes} className="flex items-center gap-2">
                  <img src={p.picture} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                  <span>{p.name}</span>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </Card>
  );
};

export default RaceCard;
