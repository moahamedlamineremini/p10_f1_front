import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { GET_PUBLIC_LEAGUES } from '../graphql/queries';
import { JOIN_LEAGUE } from '../graphql/mutations';

const LeaguesPage: React.FC = () => {
  const { data, loading, error } = useQuery(GET_PUBLIC_LEAGUES);
  const [joinLeague] = useMutation(JOIN_LEAGUE);
  const navigate = useNavigate();

  const [sharedLink, setSharedLink] = useState('');
  const [joinPrivateLoading, setJoinPrivateLoading] = useState(false);

  const handleJoin = async (leagueId: number, isPrivate: boolean) => {
    try {
      if (isPrivate) {
        alert("Pour rejoindre cette ligue privée, utilisez le lien d'invitation ci-dessous.");
        return;
      }
      const response = await joinLeague({ variables: { leagueId } });
      const league = response.data.joinLeague;
      navigate(`/leagues/${league.id}`);
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    }
  };

  const handleJoinPrivate = async () => {
    if (!sharedLink.trim()) {
      alert('Veuillez entrer un lien.');
      return;
    }
    try {
      setJoinPrivateLoading(true);
      const response = await joinLeague({ variables: { shared_link: sharedLink.trim() } });
      const league = response.data.joinLeague;
      navigate(`/leagues/${league.id}`);
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setJoinPrivateLoading(false);
    }
  };

  const goToLeagueDetails = (leagueId: number) => {
    navigate(`/leagues/${leagueId}`);
  };

  if (loading) return <p className="text-white text-center mt-10">Chargement des ligues...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">Erreur : {error.message}</p>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-6">Ligues Publiques</h1>
        {data.getPublicLeagues.length === 0 ? (
          <p className="text-accent-300">Aucune ligue publique pour l'instant.</p>
        ) : (
          <ul className="space-y-4 mb-10">
            {data.getPublicLeagues.map((league: any) => (
              <li
                key={league.id}
                className="cursor-pointer flex items-center justify-between bg-accent-900 rounded p-4 shadow-md hover:bg-accent-800 transition"
                onClick={() => goToLeagueDetails(league.id)}
              >
                <div className="flex items-center gap-4">
                  {league.avatar?.url && (
                    <img
                      src={league.avatar.url}
                      alt={`Logo ${league.name}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <span className="text-white font-semibold text-lg">{league.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" onClick={(e) => { e.stopPropagation(); handleJoin(league.id, league.private); }}>
                    Rejoindre
                  </Button>
                  <Button variant="outline" onClick={(e) => { e.stopPropagation(); goToLeagueDetails(league.id); }}>
                    Voir les membres
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="bg-accent-900 rounded p-6 shadow-md max-w-md mx-auto">
          <h2 className="text-white text-2xl mb-4">Rejoindre une ligue privée</h2>
          <input
            type="text"
            placeholder="Lien d'invitation"
            value={sharedLink}
            onChange={(e) => setSharedLink(e.target.value)}
            className="w-full p-2 mb-4 rounded border border-gray-700 bg-gray-800 text-white"
          />
          <Button
            variant="primary"
            onClick={handleJoinPrivate}
            disabled={joinPrivateLoading}
          >
            {joinPrivateLoading ? 'Connexion...' : 'Rejoindre la ligue'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default LeaguesPage;
