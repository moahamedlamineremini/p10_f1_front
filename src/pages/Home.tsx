import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME, GET_NEXT_GP, GET_UPCOMING_GPS, GET_MY_LEAGUES } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import RaceCard from '../components/RaceCard';
import LeagueCard from '../components/LeagueCard';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { GP, League, User } from '../types';
import { ChevronRight, Trophy, Flag, Users, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate, getTimeRemaining } from '../utils/dateUtils';

const Home: React.FC = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [featuredRaces, setFeaturedRaces] = useState<GP[]>([]);
  const [userLeagues, setUserLeagues] = useState<League[]>([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  const { data: userData, loading: loadingUser } = useQuery<{ getMe: User }>(GET_ME, { skip: !isAuthenticated });
  const { data: nextGPData, loading: loadingNextGP } = useQuery<any>(GET_NEXT_GP, { skip: !isAuthenticated });
  const { data: upcomingRacesData, loading: loadingRaces } = useQuery<{ gps: GP[] }>(GET_UPCOMING_GPS, {
    variables: { season: new Date().getFullYear().toString() },
    skip: !isAuthenticated,
  });
  const { data: leaguesData, loading: loadingLeagues, refetch: refetchLeagues } = useQuery<{ getMyLeagues: League[] }>(GET_MY_LEAGUES, { skip: !isAuthenticated });

  const safeNextGP = nextGPData?.getNextGP
    ? {
        ...nextGPData.getNextGP,
        id_api_races: parseInt(nextGPData.getNextGP.id_api_races, 10),
        time: nextGPData.getNextGP.time ? new Date(nextGPData.getNextGP.time).toISOString().split('T')[1].slice(0, 8) : '',
        track: {
          ...nextGPData.getNextGP.track,
          picture_country: nextGPData.getNextGP.track.picture_country || 'default-country.png',
          picture_track: nextGPData.getNextGP.track.picture_track || 'default-track.png',
        },
      }
    : null;

  useEffect(() => {
    if (upcomingRacesData?.gps) setFeaturedRaces(upcomingRacesData.gps.slice(0, 3));
    if (leaguesData?.getMyLeagues) setUserLeagues(leaguesData.getMyLeagues.slice(0, 9));
  }, [upcomingRacesData, leaguesData]);

  useEffect(() => {
    if (safeNextGP) {
      const { date, time } = safeNextGP;
      const timer = setInterval(() => {
        const timeRemaining = getTimeRemaining(date, time);
        setCountdown(timeRemaining);
        if (timeRemaining.isExpired) clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [safeNextGP]);

  const handlePlaceBet = (raceId: string | number) => {
    const idToSend = typeof raceId === 'string' ? parseInt(raceId, 10) : raceId;
    navigate(`/bet/${idToSend}`);
  };

  const handleCreateLeague = () => navigate('/leagues/create');
  const handleViewAllRaces = () => navigate('/races');
  const handleViewAllLeagues = () => navigate('/leagues');
  const handleJoinLeague = (leagueId: number) => {
    navigate(`/leagues/${leagueId}`);
    if (refetchLeagues) refetchLeagues();
  };

  return (
    <Layout>
      {/* Section principale avec la prochaine course */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-950">
          {safeNextGP?.track?.picture_track && (
            <img src="https://a.vsstatic.com/mobile/app/sports/formula-one.jpg" alt="Circuit" className="w-full h-full object-cover opacity-20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-950" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-racing font-bold text-white mb-4">
              {loadingUser ? 'Chargement...' : `Bienvenue ${userData?.getMe.firstname || authUser?.firstname} !`}
            </h1>
            {safeNextGP ? (
              <div className="bg-accent-900 border border-accent-800 p-6 rounded-lg shadow-md max-w-md w-full">
                <div className="flex items-center mb-2 justify-center">
                  <Flag size={20} className="text-primary-600 mr-2" />
                  <h2 className="text-xl font-racing text-white">Prochaine course</h2>
                </div>
                <div className="flex items-center justify-center mb-2">
                  {safeNextGP.track?.picture_country && (
                    <img src={safeNextGP.track.picture_country} alt={safeNextGP.track.country_name} className="w-8 h-6 mr-3 object-cover rounded" />
                  )}
                  <h3 className="font-racing font-bold text-xl text-white">{safeNextGP.track?.country_name} Grand Prix</h3>
                </div>
                <p className="text-accent-300 mb-4 text-center">{safeNextGP.track?.track_name} • {formatDate(safeNextGP.date)}</p>
                {!countdown.isExpired && (
                  <div className="mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <Clock size={16} className="text-primary-600 mr-2" />
                      <span className="text-sm text-accent-300">Temps restant pour parier :</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {['Jours', 'Heures', 'Minutes', 'Secondes'].map((label, i) => (
                        <div key={label} className="bg-accent-800 p-2 rounded text-center">
                          <div className="text-xl font-bold">
                            {[countdown.days, countdown.hours, countdown.minutes, countdown.seconds][i]}
                          </div>
                          <div className="text-xs text-accent-400">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Button variant="primary" onClick={() => handlePlaceBet(safeNextGP.id_api_races)} disabled={countdown.isExpired}>
                  {countdown.isExpired ? 'Paris clôturés' : 'Parier maintenant'}
                </Button>
              </div>
            ) : (
              <p className="text-accent-300">Aucune course à venir trouvée.</p>
            )}
          </div>
        </div>
      </section>

      {/* Courses à venir */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Flag size={20} className="text-primary-600 mr-2" />
            <h2 className="text-xl font-racing text-white">Courses à venir</h2>
          </div>
          <Button variant="ghost" onClick={handleViewAllRaces} className="text-accent-300 hover:text-white">
            Voir tout <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </section>

      {/* Ligues */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users size={20} className="text-secondary-600 mr-2" />
            <h2 className="text-xl font-racing text-white">Mes Ligues</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCreateLeague}><Plus size={16} className="mr-1" /> Créer</Button>
            <Button variant="ghost" onClick={handleViewAllLeagues} className="text-accent-300 hover:text-white">
              Voir tout <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
        {loadingLeagues ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse bg-accent-900 rounded-lg h-48"></div>
            ))}
          </div>
        ) : userLeagues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userLeagues.map(league => (
              <LeagueCard key={league.id} league={league} onJoin={handleJoinLeague} showInviteLink={league.private} onViewResults={(id) => navigate(`/standings?leagueId=${id}`)} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-accent-400 mb-4">Tu n'as rejoint aucune ligue</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" onClick={handleCreateLeague}><Plus size={16} className="mr-1" /> Créer une ligue</Button>
                <Button variant="outline" onClick={handleViewAllLeagues}>Explorer les ligues</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Appel à l'action */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-900 to-secondary-900 rounded-lg overflow-hidden shadow-xl">
          <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:py-16">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-racing font-bold tracking-tight text-white">Prêt à viser le championnat ?</h2>
              <p className="mt-4 max-w-3xl text-lg text-accent-100">Prédit le P10 et le premier abandon pour chaque Grand Prix. Rejoins des ligues avec tes amis et grimpe au classement !</p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8 flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <Button variant="primary" size="lg" onClick={() => safeNextGP && handlePlaceBet(safeNextGP.id_api_races)}>
                <Trophy size={18} className="mr-2" /> Parier
              </Button>
              <Button variant="outline" size="lg" onClick={handleCreateLeague}>
                <Users size={18} className="mr-2" /> Créer une ligue
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;