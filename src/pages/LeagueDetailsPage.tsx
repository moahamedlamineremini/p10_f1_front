import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_LEAGUE_USERS } from '../graphql/queries';
import Layout from '../components/layout/Layout';

const LeagueDetailsPage: React.FC = () => {
  const { leagueId } = useParams<{ leagueId: string }>();

  const parsedLeagueId = parseInt(leagueId ?? '', 10);

  const { data, loading, error } = useQuery(GET_LEAGUE_USERS, {
    variables: { leagueId: parsedLeagueId },
    skip: isNaN(parsedLeagueId),
  });

  if (isNaN(parsedLeagueId)) {
    return <p className="text-red-500 text-center mt-10">ID de ligue invalide.</p>;
  }

  if (loading) return <p className="text-white text-center mt-10">Chargement des membres...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">Erreur : {error.message}</p>;

  const users = data.getLeagueUsers;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl text-white font-bold mb-6">Membres de la ligue</h1>
        <ul className="space-y-4">
          {users.map((user: any) => (
            <li
              key={user.id}
              className="bg-accent-900 text-white rounded p-4 shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{user.firstname} {user.lastname}</p>
                <p className="text-accent-200 text-sm">{user.email}</p>
              </div>
              <span className="bg-accent-700 text-xs px-2 py-1 rounded">{user.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default LeagueDetailsPage;
