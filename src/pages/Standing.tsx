import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_ALL_GPS,
  GET_GP_CLASSEMENT,
  GET_LIGUE_CLASSEMENT,
} from '../graphql/queries';
import Layout from '../components/layout/Layout';
import Select from '../components/ui/Selectstanding';
import { Trophy } from 'lucide-react';

const Standing: React.FC = () => {
  const [view, setView] = useState<'gp' | 'league'>('gp');
  const [selectedGP, setSelectedGP] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState('1');

  const { data: allGpsData } = useQuery(GET_ALL_GPS);

  const {
    data: gpData,
    loading: loadingGP,
    error: gpError,
  } = useQuery(GET_GP_CLASSEMENT, {
    variables: { gpId: selectedGP },
    skip: view !== 'gp' || !selectedGP,
  });

  const {
    data: leagueData,
    loading: loadingLeague,
    error: leagueError,
  } = useQuery(GET_LIGUE_CLASSEMENT, {
    variables: { leagueId: selectedLeague },
    skip: view !== 'league',
  });

  // Auto-select first GP with classement on load
  useEffect(() => {
    if (!selectedGP && view === 'gp' && allGpsData?.getAllGPs?.length > 0) {
      const defaultGp = allGpsData.getAllGPs.find(
        (gp: any) => gp.id_api_races === '1748131200000'
      );
      if (defaultGp) {
        setSelectedGP(defaultGp.id_api_races.toString());
      }
    }
  }, [allGpsData, selectedGP, view]);

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
                view === 'gp'
                  ? 'bg-primary text-white'
                  : 'bg-accent-800 text-white'
              }`}
              onClick={() => setView('gp')}
            >
              GP
            </button>
            <button
              className={`px-4 py-2 rounded ${
                view === 'league'
                  ? 'bg-primary text-white'
                  : 'bg-accent-800 text-white'
              }`}
              onClick={() => setView('league')}
            >
              League
            </button>
          </div>
        </div>

        {/* Select GP */}
        {view === 'gp' && (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Select GP:</label>
            <Select
              value={selectedGP}
              onChange={(e) => setSelectedGP(e.target.value)}
            >
              <option value="">-- Sélectionner un GP --</option>
              {allGpsData?.getAllGPs.map((gp: any) => (
                <option
                  key={gp.id_api_races}
                  value={gp.id_api_races.toString()}
                >
                  {gp.track.track_name} — {gp.date}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Select League */}
        {view === 'league' && (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Select League:</label>
            <Select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
            >
              <option value="1">League #1</option>
              <option value="2">League #2</option>
            </Select>
          </div>
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
                      <span className="text-xl font-bold text-primary">
                        {entry.position}
                      </span>
                      
                      {entry.isDNF && (
                        <span className="text-red-500 text-xs">DNF</span>
                      )}
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
        ) : leagueData?.classementLigue?.length === 0 ? (
          <div className="text-accent-400">Aucun classement pour cette ligue.</div>
        ) : (
          <div className="space-y-4">
            {leagueData.classementLigue.map((entry: any, i: number) => (
              <div
                key={i}
                className="bg-accent-900 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={entry.user.avatar?.picture_avatar}
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
                  <p className="text-lg font-bold">{entry.totalPoints} pts</p>
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
