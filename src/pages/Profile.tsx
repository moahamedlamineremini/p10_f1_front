import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ME,
  GET_MY_LEAGUES,
  GET_MY_BETS,
  GET_LEAGUE_USERS,
} from '../graphql/queries';
import { UPDATE_USER, DELETE_USER } from '../graphql/mutations';
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
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);

  const { data: leagueUsersData, loading: loadingUsers } = useQuery(GET_LEAGUE_USERS, {
    variables: { leagueId: selectedLeagueId },
    skip: selectedLeagueId === null,
  });

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    password: ''
  });

  useEffect(() => {
    if (meData?.getMe) {
      setFormData(prev => ({
        ...prev,
        firstname: meData.getMe.firstname,
        lastname: meData.getMe.lastname
      }));
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
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      await deleteUser();
      logout();
      navigate('/login');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Mon Profil</h1>

        {error && <p className="text-red-500">Erreur: {error.message}</p>}

        {loadingMe ? (
          <p className="text-white">Chargement...</p>
        ) : (
          <>
            {meData.getMe.avatar?.picture_avatar && (
              <div className="flex justify-center mb-6">
                <img
                  src={meData.getMe.avatar.picture_avatar}
                  alt="Avatar utilisateur"
                  className="w-24 h-24 rounded-full border-2 border-primary-600 shadow-md"
                />
              </div>
            )}

            {/* Formulaire utilisateur */}
            <div className="space-y-6 mb-10">
              <Input
                id="email"
                name="email"
                type="email"
                label="Adresse e-mail"
                value={meData.getMe.email}
                disabled
                fullWidth
              />
              <Input
                id="firstname"
                name="firstname"
                label="Prénom"
                value={formData.firstname}
                onChange={handleChange}
                fullWidth
              />
              <Input
                id="lastname"
                name="lastname"
                label="Nom"
                value={formData.lastname}
                onChange={handleChange}
                fullWidth
              />
              <Input
                id="password"
                name="password"
                type="password"
                label="Nouveau mot de passe"
                value={formData.password}
                onChange={handleChange}
                fullWidth
              />
              <Button
                variant="primary"
                onClick={handleUpdate}
                isLoading={updating}
                fullWidth
              >
                Mettre à jour
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                isLoading={deleting}
                fullWidth
              >
                Supprimer mon compte
              </Button>
            </div>

            {/* Mes Ligues */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">Mes Ligues</h2>
              {leaguesData?.getMyLeagues?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {leaguesData.getMyLeagues.map((league: any) => (
                    <div
                      key={league.id}
                      className="bg-accent-900 border border-accent-800 p-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
                      onClick={() =>
                        setSelectedLeagueId(
                          selectedLeagueId === league.id ? null : league.id
                        )
                      }
                    >
                      <h3 className="text-lg font-bold text-white">{league.name}</h3>
                      <p className="text-sm text-accent-400">
                        Statut : {league.private ? 'Privée' : 'Publique'}
                      </p>
                      {league.avatar?.picture_avatar && (
                        <img
                          src={league.avatar.picture_avatar}
                          alt="Avatar ligue"
                          className="mt-3 w-16 h-16 rounded-full border border-primary-600 object-cover"
                        />
                      )}

                      {selectedLeagueId === league.id && (
                        <div className="mt-4 bg-accent-800 p-3 rounded-lg">
                          <h4 className="text-sm font-semibold text-white mb-2">
                            Membres :
                          </h4>
                          {loadingUsers ? (
                            <p className="text-accent-400">Chargement...</p>
                          ) : leagueUsersData?.getLeagueUsers?.length > 0 ? (
                            <ul className="space-y-1">
                              {leagueUsersData.getLeagueUsers.map((member: any) => (
                                <li
                                  key={member.id}
                                  className="text-sm text-accent-300"
                                >
                                  {member.firstname} {member.lastname} — {member.role}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-accent-400">Aucun membre.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-accent-400">Tu n’as rejoint aucune ligue.</p>
              )}
            </div>

            {/* Mes Paris */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Mes Paris</h2>
              {betsData?.getMyBets?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {betsData.getMyBets.map((bet: any) => (
                    <div
                      key={bet.id}
                      className="bg-accent-900 border border-accent-800 p-4 rounded-xl shadow-md hover:shadow-lg transition duration-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-white">
                          {bet.gp.track.track_name}
                        </h3>
                        <p className="text-sm text-accent-400">
                          {new Date(bet.gp.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 text-sm text-accent-300">
                        <span>
                          P10 : <strong>{bet.pilote_p10.name}</strong>
                        </span>
                        <span>
                          DNF : <strong>{bet.pilote_dnf.name}</strong>
                        </span>
                        <span className="text-accent-400 mt-2">
                          Points :{' '}
                          <strong>P10 = {bet.points_p10 || 0}</strong> /{' '}
                          <strong>DNF = {bet.points_dnf || 0}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-accent-400">Tu n’as pas encore fait de paris.</p>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
