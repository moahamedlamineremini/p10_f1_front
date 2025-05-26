import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_LEAGUE_USERS } from '../graphql/queries';
import Layout from '../components/layout/Layout';


const LeagueDetailsPage: React.FC = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();

  const parsedLeagueId = parseInt(leagueId ?? '', 10);

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_LEAGUE_USERS, {
    variables: { leagueId: parsedLeagueId },
    skip: isNaN(parsedLeagueId),
  });

  // Rafraîchir automatiquement les données toutes les 3 secondes 
  useEffect(() => {
    if (isNaN(parsedLeagueId)) return;

    const interval = setInterval(() => {
      refetch();
    }, 500); // Toutes les 5ms

    return () => clearInterval(interval);
  }, [parsedLeagueId, refetch]);

  if (isNaN(parsedLeagueId)) {
    return <p className="text-red-500 text-center mt-10">ID de ligue invalide.</p>;
  }

  if (loading && !data) {
    return <p className="text-white text-center mt-10">Chargement des membres...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500 text-center mt-10">
        Erreur lors du chargement des membres : {error.message}
      </p>
    );
  }

  const users = data?.getLeagueUsers || [];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Membres de la ligue</h1>

        {users.length === 0 ? (
          <p className="text-accent-300 mb-6">Aucun membre trouvé pour cette ligue.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((userLeague: any) => (
  <li
    key={userLeague.id}
    className="bg-accent-900 text-white rounded p-4 shadow flex justify-between items-center"
  >
    <div>
      <p className="font-semibold">
        {userLeague.user.firstname} {userLeague.user.lastname}
      </p>
      <p className="text-accent-200 text-sm">{userLeague.user.email}</p>
    </div>
    <span className="bg-accent-700 text-xs px-2 py-1 rounded">{userLeague.role}</span>
  </li>
))}

          </ul>
        )}

        {/* Bouton pour forcer le rafraîchissement manuel */}
        <div className="mt-6 text-center">
          <button
            onClick={() => refetch()}
            className="text-primary-500 hover:text-primary-400 text-sm"
            type="button"
          >
            Rafraîchir les données
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LeagueDetailsPage;