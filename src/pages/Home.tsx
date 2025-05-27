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


  // Get user data
  const { data: userData, loading: loadingUser } = useQuery<{ getMe: User }>(GET_ME, {
    skip: !isAuthenticated,
  });

  // Get next GP (with any type to avoid strict typing)
  const { data: nextGPData, loading: loadingNextGP } = useQuery<any>(GET_NEXT_GP, {
  skip: !isAuthenticated,
});

const safeNextGP = nextGPData?.getNextGP
  ? {
      ...nextGPData.getNextGP,
      id_api_races: parseInt(nextGPData.getNextGP.id_api_races, 10),
      time: nextGPData.getNextGP.time
        ? new Date(nextGPData.getNextGP.time).toISOString().split('T')[1].slice(0, 8)
        : '', // <-- extrait juste HH:MM:SS
      track: {
        ...nextGPData.getNextGP.track,
        picture_country: nextGPData.getNextGP.track.picture_country || 'default-country.png',
        picture_track: nextGPData.getNextGP.track.picture_track || 'default-track.png',
      },
    }
  : null;




  // Get upcoming races
  const { data: upcomingRacesData, loading: loadingRaces } = useQuery<{ gps: GP[] }>(GET_UPCOMING_GPS, {
    variables: { season: new Date().getFullYear().toString() },
    skip: !isAuthenticated,
  });

  // Get user leagues
  const { data: leaguesData, loading: loadingLeagues, refetch: refetchLeagues } = useQuery<{
  getMyLeagues: League[];
}>(GET_MY_LEAGUES, {
  skip: !isAuthenticated,
});

  useEffect(() => {
    if (upcomingRacesData?.gps) {
      setFeaturedRaces(upcomingRacesData.gps.slice(0, 3));
    }
    if (leaguesData?.getMyLeagues) {
      setUserLeagues(leaguesData.getMyLeagues.slice(0, 9));
    }
  }, [upcomingRacesData, leaguesData]);

  // Countdown timer effect
  useEffect(() => {
    if (safeNextGP) {
      const { date, time } = safeNextGP;
      const timer = setInterval(() => {
        const timeRemaining = getTimeRemaining(date, time);
        setCountdown(timeRemaining);
        if (timeRemaining.isExpired) {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [safeNextGP]);

  const handlePlaceBet = (raceId: string | number) => {
    const idToSend = typeof raceId === 'string' ? parseInt(raceId, 10) : raceId;
    navigate(`/bet/${idToSend}`);
  };

  const handleViewAllRaces = () => {
    navigate('/races');
  };

  const handleViewAllLeagues = () => {
    navigate('/leagues');
  };

  const handleCreateLeague = () => {
    navigate('/leagues/create');
  };

const handleJoinLeague = (leagueId: number) => {
  console.log("Navigating to league:", leagueId);
  navigate(`/leagues/${leagueId}`);
  
  if (refetchLeagues) {
    console.log("Trying to refetch leagues...");
    refetchLeagues();
  } else {
    console.warn("refetchLeagues is undefined");
  }
};


  return (
    <Layout>
      {/* Hero section with next race */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-950">
          {safeNextGP?.track?.picture_track && (
            <img
              src="https://a.vsstatic.com/mobile/app/sports/formula-one.jpg"
              alt="Next race track image"
              className="w-full h-full object-cover opacity-20"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-950"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl font-racing font-bold text-white mb-4">
                {loadingUser ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>Welcome, {userData?.getMe.firstname || authUser?.firstname}!</>
                )}
              </h1>
              {loadingNextGP ? (
                <div className="animate-pulse h-24 bg-accent-800 rounded"></div>
              ) : safeNextGP ? (
                <div>
                  <div className="flex items-center mb-2">
                    <Flag size={20} className="text-primary-600 mr-2" />
                    <h2 className="text-xl font-racing text-white">Next Race</h2>
                  </div>
                  <div className="bg-accent-900 border border-accent-800 p-4 rounded-lg shadow-md">
                    <div className="flex items-center mb-2">
                      {safeNextGP.track?.picture_country && (
                        <img
                          src={safeNextGP.track.picture_country}
                          alt={safeNextGP.track.country_name}
                          className="w-8 h-6 mr-3 object-cover rounded"
                        />
                      )}
                      <h3 className="font-racing font-bold text-xl">
                        {safeNextGP.track?.country_name} Grand Prix
                      </h3>
                    </div>
                    <p className="text-accent-300 mb-4">
                      {safeNextGP.track?.track_name} • {formatDate(safeNextGP.date)}
                    </p>
                    {/* Countdown Timer */}
                    {!countdown.isExpired && (
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <Clock size={16} className="text-primary-600 mr-2" />
                          <span className="text-sm text-accent-300">Time remaining to place your bet:</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-accent-800 p-2 rounded text-center">
                            <div className="text-xl font-bold">{countdown.days}</div>
                            <div className="text-xs text-accent-400">Days</div>
                          </div>
                          <div className="bg-accent-800 p-2 rounded text-center">
                            <div className="text-xl font-bold">{countdown.hours}</div>
                            <div className="text-xs text-accent-400">Hours</div>
                          </div>
                          <div className="bg-accent-800 p-2 rounded text-center">
                            <div className="text-xl font-bold">{countdown.minutes}</div>
                            <div className="text-xs text-accent-400">Minutes</div>
                          </div>
                          <div className="bg-accent-800 p-2 rounded text-center">
                            <div className="text-xl font-bold">{countdown.seconds}</div>
                            <div className="text-xs text-accent-400">Seconds</div>
                          </div>
                        </div>
                      </div>
                    )}
                    <Button 
                      variant="primary"
                      onClick={() => handlePlaceBet(safeNextGP.id_api_races)}
                      disabled={countdown.isExpired}
                    >
                      {countdown.isExpired ? 'Betting Closed' : 'Place Bet'}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-accent-300">No upcoming races found.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured races section */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Flag size={20} className="text-primary-600 mr-2" />
            <h2 className="text-xl font-racing text-white">Upcoming Races</h2>
          </div>
          <Button 
            variant="ghost"
            onClick={handleViewAllRaces}
            className="text-accent-300 hover:text-white"
          >
            View all <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        {loadingRaces ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-accent-900 rounded-lg h-64"></div>
            ))}
          </div>
        ) : featuredRaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRaces.map(race => (
              <RaceCard 
                key={race.id_api_races} 
                race={race} 
                onPlaceBet={handlePlaceBet}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-accent-400 mb-4">No upcoming races available</p>
              <Button 
                variant="outline"
                onClick={handleViewAllRaces}
              >
                View race history
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Leagues section */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users size={20} className="text-secondary-600 mr-2" />
            <h2 className="text-xl font-racing text-white">Your Leagues</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleCreateLeague}
            >
              <Plus size={16} className="mr-1" /> Create
            </Button>
            <Button 
              variant="ghost"
              onClick={handleViewAllLeagues}
              className="text-accent-300 hover:text-white"
            >
              View all <ChevronRight size={16} className="ml-1" />
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

            {userLeagues.map(league => {
  const isOwnerOfPrivateLeague = league.private ;

  return (
    <LeagueCard 
      key={league.id} 
      league={league}
      onJoin={handleJoinLeague}
      showInviteLink={isOwnerOfPrivateLeague}
      onViewResults={(leagueId: number) => navigate(`/standings?leagueId=${leagueId}`)}
    />
  );
})}

          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-accent-400 mb-4">You haven't joined any leagues yet</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="primary"
                  onClick={handleCreateLeague}
                >
                  <Plus size={16} className="mr-1" /> Create a league
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleViewAllLeagues}
                >
                  Browse leagues
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Call-to-action section */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-900 to-secondary-900 rounded-lg overflow-hidden shadow-xl">
          <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:py-16">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-racing font-bold tracking-tight text-white">
                Ready to compete for the championship?
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-accent-100">
                Predict the P10 and first DNF for each Grand Prix. Join leagues with friends and climb the leaderboard!
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8 flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <Button 
                variant="primary"
                size="lg"
                onClick={() => safeNextGP && handlePlaceBet(safeNextGP.id_api_races)}
              >
                <Trophy size={18} className="mr-2" /> Place Bet
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={handleCreateLeague}
              >
                <Users size={18} className="mr-2" /> Create League
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;