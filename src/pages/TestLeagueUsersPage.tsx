import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_LEAGUE_USERS } from '../graphql/queries';

const TestTokenPage: React.FC = () => {
  const { token, user } = useAuth();
  const { data, error, loading } = useQuery(GET_LEAGUE_USERS, {
    variables: { leagueId: 1 }, // test avec une vraie ID
  });

  return (
    <div className="p-4">
      <h1>Test Token Page</h1>
      <p><strong>Token :</strong> {token}</p>
      <p><strong>User :</strong> {JSON.stringify(user)}</p>

      <h2>Test requête :</h2>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>Erreur : {error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default TestTokenPage;
