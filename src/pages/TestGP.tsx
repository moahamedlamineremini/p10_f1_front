// src/pages/TestUpcomingGPs.tsx

import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_UPCOMING_GPS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';

const TestUpcomingGPs = () => {
  const { isAuthenticated } = useAuth();

  const { data, loading, error } = useQuery<{ gps: any[] }>(GET_UPCOMING_GPS, {
    variables: { season: new Date().getFullYear().toString() },
    skip: !isAuthenticated,
  });

  useEffect(() => {
    console.log('🚀 Données brutes (upcoming GPs):', data);
    console.log('⚠️ Erreur GraphQL:', error);
  }, [data, error]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-6">Test - GPs à venir</h1>

        {loading && <p className="text-accent-300">Chargement des GPs...</p>}

        {error && (
          <div className="bg-red-900 border border-red-700 p-4 rounded text-red-100 mb-6">
            <strong>Erreur GraphQL :</strong>
            <pre className="mt-2 text-sm overflow-x-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {!loading && !error && (!data || data.gps.length === 0) && (
          <p className="text-yellow-400">Aucun GP à venir trouvé.</p>
        )}

        {!loading && !error && data?.gps.length > 0 && (
          <div className="space-y-6">
            {data.gps.map((gp) => (
              <div key={gp.id_api_races} className="bg-accent-950 border border-accent-800 rounded-lg p-4 text-accent-100 shadow">
                <h2 className="text-xl font-semibold mb-2">{gp.track.track_name} ({gp.track.country_name})</h2>
                <p className="text-sm mb-1">📅 {gp.date} à {gp.time}</p>
                {gp.track.picture_track && (
                  <img
                    src={gp.track.picture_track}
                    alt={gp.track.track_name}
                    className="w-full max-w-md rounded-lg border border-accent-700 mt-2"
                  />
                )}
                {/* Données brutes pour debug */}
                <details className="mt-2 text-sm">
                  <summary className="cursor-pointer text-accent-400">Voir les données JSON</summary>
                  <pre className="mt-2 bg-accent-900 p-2 rounded overflow-x-auto">
                    {JSON.stringify(gp, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TestUpcomingGPs;
