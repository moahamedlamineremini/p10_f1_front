import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ME,
  GET_MY_LEAGUES,
  GET_MY_BETS,
  GET_LEAGUE_USERS,
} from '../graphql/queries';
import {
  UPDATE_USER,
  DELETE_USER,
  DELETE_BET_SELECTION,
} from '../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Profile: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: meData, loading: loadingMe, error, refetch } = useQuery(GET_ME);
  const { data: leaguesData } = useQuery(GET_MY_LEAGUES);
  const { data: betsData } = useQuery(GET_MY_BETS);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER);
  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER);
  const [deleteUserBet] = useMutation(DELETE_BET_SELECTION);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);

  const { data: leagueUsersData, loading: loadingUsers } = useQuery(GET_LEAGUE_USERS, {
    variables: { leagueId: selectedLeagueId },
    skip: selectedLeagueId === null,
  });

  const [formData, setFormData] = useState({ firstname: '', lastname: '', password: '' });

  useEffect(() => {
    if (meData?.getMe) {
      setFormData({
        firstname: meData.getMe.firstname,
        lastname: meData.getMe.lastname,
        password: '',
      });
    }
  }, [meData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await updateUser({
      variables: {
        firstname: formData.firstname,
        lastname: formData.lastname,
        password: formData.password || undefined,
      },
    });
    refetch();
    alert('Profil mis à jour');
  };

  const handleDelete = async () => {
    if (confirm('Supprimer ton compte ?')) {
      await deleteUser();
      logout();
      navigate('/login');
    }
  };

  const now = useMemo(() => new Date(), []);

  const pendingBets = useMemo(() => {
    if (!betsData?.getMyBets) return [];
    return betsData.getMyBets.filter((bet: any) => new Date(bet.gp.date) > now);
  }, [betsData, now]);

  const pastBets = useMemo(() => {
    if (!betsData?.getMyBets) return [];
    return betsData.getMyBets.filter((bet: any) => new Date(bet.gp.date) <= now);
  }, [betsData, now]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12 bg-black text-white">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold uppercase tracking-widest text-red-600">Mon Profil</h1>
          {meData?.getMe.avatar?.picture_avatar && (
            <img
              src={meData.getMe.avatar.picture_avatar}
              alt="Avatar"
              className="mx-auto mt-6 w-28 h-28 rounded-full border-4 border-red-600 shadow-xl"
            />
          )}
        </div>

        {error && <p className="text-red-400 text-center">Erreur: {error.message}</p>}

        {!loadingMe && (
          <div className="grid gap-6 bg-neutral-900 p-6 rounded-xl border border-neutral-700 mb-10">
            <Input id="email" name="email" type="email" label="Email" value={meData.getMe.email} disabled fullWidth />
            <Input id="firstname" name="firstname" label="Prénom" value={formData.firstname} onChange={handleChange} fullWidth />
            <Input id="lastname" name="lastname" label="Nom" value={formData.lastname} onChange={handleChange} fullWidth />
            <Input id="password" name="password" type="password" label="Mot de passe" value={formData.password} onChange={handleChange} fullWidth />
            <Button variant="primary" onClick={handleUpdate} isLoading={updating} className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase">Mettre à jour</Button>
            <Button variant="destructive" onClick={handleDelete} isLoading={deleting} className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold uppercase">Supprimer mon compte</Button>
          </div>
        )}

        <div className="mb-10">
          <h2 className="text-2xl font-bold border-b border-red-600 pb-1 mb-4 uppercase">Mes Ligues</h2>
          {leaguesData?.getMyLeagues?.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {leaguesData.getMyLeagues.map((league: any) => (
                <div key={league.id} onClick={() => setSelectedLeagueId(league.id)}
                  className="bg-neutral-900 p-4 rounded-xl border border-neutral-700 hover:border-red-600 transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    {league.avatar?.picture_avatar && (
                      <img src={league.avatar.picture_avatar} alt="Avatar ligue" className="w-12 h-12 rounded-full" />
                    )}
                    <div>
                      <h3 className="font-bold text-white text-lg">{league.name}</h3>
                      <p className="text-sm text-neutral-400">{league.private ? 'Privée' : 'Publique'}</p>
                    </div>
                  </div>
                  {selectedLeagueId === league.id && leagueUsersData?.getLeagueUsers && (
                    <div className="mt-4 text-sm text-neutral-300">
                      <p className="font-semibold text-white mb-1">Membres :</p>
                      <ul className="pl-3 list-disc">
                        {leagueUsersData.getLeagueUsers.map((user: any) => (
                          <li key={user.id}>{user.user.firstname} {user.user.lastname} — {user.role}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400">Tu n'as rejoint aucune ligue.</p>
          )}
        </div>

        {pendingBets.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold border-b border-red-600 pb-1 mb-4 uppercase">Paris en cours</h2>
            <div className="grid gap-4">
              {pendingBets.map((bet: any) => (
                <div key={bet.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-semibold text-lg">{bet.gp.track.track_name}</h3>
                    <p className="text-neutral-400 text-sm">{new Date(bet.gp.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm">P10 : <span className="font-semibold text-white">{bet.pilote_p10.name}</span></p>
                  <p className="text-sm">DNF : <span className="font-semibold text-white">{bet.pilote_dnf.name}</span></p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/bet/${bet.gp.id_api_races}`)}>Modifier</Button>
                    <Button variant="destructive" size="sm" onClick={() => {
                      if (confirm('Supprimer ce pari ?')) {
                        deleteUserBet({ variables: { betId: bet.id } }).then(() => refetch());
                      }
                    }}>Supprimer</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold border-b border-red-600 pb-1 mb-4 uppercase">Paris passés</h2>
          {pastBets.length > 0 ? (
            <div className="grid gap-4">
              {pastBets.map((bet: any) => (
                <div key={bet.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-semibold text-lg">{bet.gp.track.track_name}</h3>
                    <p className="text-neutral-400 text-sm">{new Date(bet.gp.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm">P10 : <span className="font-semibold text-white">{bet.pilote_p10.name}</span></p>
                  <p className="text-sm">DNF : <span className="font-semibold text-white">{bet.pilote_dnf.name}</span></p>
                  <p className="text-sm mt-2 text-neutral-400">
                    Points : <strong className="text-white">P10 = {bet.points_p10 || 0}</strong> / <strong className="text-white">DNF = {bet.points_dnf || 0}</strong>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400">Tu n’as pas encore de paris passés.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;