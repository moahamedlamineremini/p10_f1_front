import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom';

import {
  GET_ALL_GPS,
  GET_GP_CLASSEMENT,
  GET_LIGUE_CLASSEMENT,
  GET_MY_LEAGUES,
} from '../graphql/queries';
import Layout from '../components/layout/Layout';
import Select from '../components/ui/Selectstanding';
import { Trophy } from 'lucide-react';

const Standing: React.FC = () => {
  const [view, setView] = useState<'gp' | 'league'>('gp');
  const [selectedGP, setSelectedGP] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [pointFilter, setPointFilter] = useState<'total' | 'p10' | 'dnf'>('total');

  const { data: allGpsData } = useQuery(GET_ALL_GPS);
  const { data: myLeaguesData, loading: loadingLeagues } = useQuery(GET_MY_LEAGUES);

  const { data: gpData, loading: loadingGP, error: gpError } = useQuery(GET_GP_CLASSEMENT, {
    variables: { gpId: selectedGP },
    skip: view !== 'gp' || !selectedGP,
  });

  const { data: leagueData, loading: loadingLeague, error: leagueError } = useQuery(
    GET_LIGUE_CLASSEMENT,
    {
      variables: { leagueId: selectedLeague },
      skip: view !== 'league' || !selectedLeague,
    }
  );

  
  const location = useLocation();

useEffect(() => {
  const searchParams = new URLSearchParams(location.search);
  const leagueIdFromURL = searchParams.get('leagueId');
  if (leagueIdFromURL && !selectedLeague) {
    setView('league');
    setSelectedLeague(leagueIdFromURL);
  }
}, [location.search, selectedLeague]);


  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <Trophy className="text-yellow-400" />
            <span>Standings</span>
          </h1>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded ${
                view === 'gp' ? 'bg-primary text-white' : 'bg-accent-800 text-white'
              }`}
              onClick={() => setView('gp')}
            >
              GP
            </button>
            <button
              className={`px-4 py-2 rounded ${
                view === 'league' ? 'bg-primary text-white' : 'bg-accent-800 text-white'
              }`}
              onClick={() => setView('league')}
            >
              League
            </button>
          </div>
        </div>

        {/* GP Selector */}
        {view === 'gp' && (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Select GP:</label>
            <Select value={selectedGP} onChange={(e) => setSelectedGP(e.target.value)}>
              <option value="">-- Sélectionner un GP --</option>
              {allGpsData?.getAllGPs.map((gp: any) => (
                <option key={gp.id_api_races} value={gp.id_api_races.toString()}>
                  {gp.track.track_name} — {gp.date}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* League Selector */}
        {view === 'league' && (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Select League:</label>
              <Select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)}>
                <option value="">-- Sélectionner une ligue --</option>
                {myLeaguesData?.getMyLeagues.map((league: any) => (
                  <option key={league.id} value={league.id.toString()}>
                    {league.name} {league.private ? '🔒' : ''}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <span className="text-sm text-accent-400">Filtrer par :</span>
              <button
                onClick={() => setPointFilter('total')}
                className={`px-3 py-1 rounded ${
                  pointFilter === 'total' ? 'bg-primary text-white' : 'bg-accent-800 text-white'
                }`}
              >
                Total
              </button>
              <button
                onClick={() => setPointFilter('p10')}
                className={`px-3 py-1 rounded ${
                  pointFilter === 'p10' ? 'bg-primary text-white' : 'bg-accent-800 text-white'
                }`}
              >
                P10
              </button>
              <button
                onClick={() => setPointFilter('dnf')}
                className={`px-3 py-1 rounded ${
                  pointFilter === 'dnf' ? 'bg-primary text-white' : 'bg-accent-800 text-white'
                }`}
              >
                DNF
              </button>
            </div>
          </>
        )}

        {/* CONTENT */}
        {view === 'gp' ? (
          loadingGP ? (
            <div className="text-center py-6 text-accent-400">Chargement...</div>
          ) : gpError ? (
            <div className="text-red-500">{gpError.message}</div>
          ) : !selectedGP ? (
            <div className="text-accent-400">Veuillez sélectionner un Grand Prix.</div>
          ) : gpData?.getClassementByGP?.length === 0 ? (
            <div className="text-accent-400">Aucun classement pour ce Grand Prix.</div>
          ) : (
            <div className="space-y-4">
              {gpData.getClassementByGP.map((entry: any, i: number) => (
                <div
                  key={i}
                  className={`bg-accent-900 p-4 rounded-lg flex items-center justify-between ${
                    i === 0
                      ? 'border-l-4 border-yellow-400'
                      : i === 1
                      ? 'border-l-4 border-gray-400'
                      : i === 2
                      ? 'border-l-4 border-orange-400'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center justify-center w-10">
                      <span className="text-xl font-bold text-primary">{entry.position}</span>
                      {entry.isDNF && <span className="text-red-500 text-xs">DNF</span>}
                    </div>
                    <img
                      src={entry.pilote.picture}
                      alt={entry.pilote.name}
                      className="w-12 h-12 rounded-full object-cover border border-accent-700"
                    />
                    <div>
                      <p className="text-white font-semibold">{entry.pilote.name}</p>
                      <p className="text-accent-400 text-sm">{entry.ecurie.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : loadingLeague ? (
          <div className="text-center py-6 text-accent-400">Chargement...</div>
        ) : leagueError ? (
          <div className="text-red-500">{leagueError.message}</div>
        ) : !leagueData ? (
          <div className="text-accent-400">Erreur : données introuvables.</div>
        ) : leagueData.classementLigue.length === 0 ? (
          <div className="text-accent-400">Aucun classement pour cette ligue.</div>
        ) : (
          <div className="space-y-4">
            {leagueData.classementLigue
              .map((entry: any) => {
                const p10 =
                  entry.user.bets?.reduce((sum: number, bet: any) => sum + parseInt(bet.points_p10 || '0'), 0) || 0;
                const dnf =
                  entry.user.bets?.reduce((sum: number, bet: any) => sum + parseInt(bet.points_dnf || '0'), 0) || 0;
                const total =
                  pointFilter === 'p10' ? p10 : pointFilter === 'dnf' ? dnf : entry.totalPoints;
                return { ...entry, displayPoints: total };
              })
              .sort((a, b) => b.displayPoints - a.displayPoints)
              .map((entry: any, i: number) => (
                <div key={i} className="bg-accent-900 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
  src={entry.user.avatar?.picture_avatar || 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'}
  alt={entry.user.firstname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-white font-semibold">
                        {entry.user.firstname} {entry.user.lastname}
                      </p>
                      <p className="text-accent-400 text-sm">{entry.user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{entry.displayPoints} pts</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Standing;