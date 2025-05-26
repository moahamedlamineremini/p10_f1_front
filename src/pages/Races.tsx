import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_GPS, GET_UPCOMING_GPS, GET_PAST_GPS } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RaceCard from '../components/RaceCard';
import Button from '../components/ui/Button';
import { GP } from '../types';
import { Calendar, Filter } from 'lucide-react';

const Races: React.FC = () => {
  const navigate = useNavigate();
  const [races, setRaces] = useState<GP[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const currentYear = new Date().getFullYear().toString();

  // Associe les filtres à leurs requêtes GraphQL
  const queries = {
    all: GET_ALL_GPS,
    upcoming: GET_UPCOMING_GPS,
    past: GET_PAST_GPS,
  };

  // Exécute dynamiquement la requête en fonction du filtre
  const { data, loading, refetch } = useQuery<{ getAllGPs?: GP[], getUpcomingGPs?: GP[], getPastGPs?: GP[] }>(
    queries[filter]
  );

  useEffect(() => {
    if (data) {
      const key = {
        all: 'getAllGPs',
        upcoming: 'getUpcomingGPs',
        past: 'getPastGPs',
      }[filter] as keyof typeof data;

      if (data[key]) {
        setRaces(data[key] as GP[]);
      }
    }
  }, [data, filter]);

  const handlePlaceBet = (raceId: string) => {
    navigate(`/bet/${raceId}`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <Calendar size={24} className="text-primary-600 mr-2" />
            <h1 className="text-2xl font-racing font-bold">
              Formula 1 Calendar {currentYear}
            </h1>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center space-x-2 bg-accent-900 p-1 rounded-lg">
            <Filter size={16} className="text-accent-400 ml-2" />
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Races
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'past' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('past')}
            >
              Past
            </Button>
          </div>
        </div>

        {/* Races grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-accent-900 rounded-lg h-64"
              ></div>
            ))}
          </div>
        ) : races.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {races.map((race) => (
              <RaceCard
                key={race.id_api_races}
                race={race}
                onPlaceBet={handlePlaceBet}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-accent-400">
              No races found for the selected filter.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Races;
