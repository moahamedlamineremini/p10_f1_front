import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const CREATE_LEAGUE = gql`
  mutation CreateLeague($name: String!, $private: Boolean!) {
    createLeague(name: $name, private: $private) {
      id
      name
      private
      shared_link
      active
    }
  }
`;

const CreateLeaguePage: React.FC = () => {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();

  const [createLeague, { loading, error }] = useMutation(CREATE_LEAGUE, {
    onCompleted: (data) => {
      navigate(`/leagues/${data.createLeague.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Veuillez entrer un nom pour la ligue.');

    createLeague({
      variables: {
        name,
        private: isPrivate,
      },
    });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-accent-900 rounded shadow-md mt-10">
        <h1 className="text-3xl mb-6 font-bold text-white text-center">Créer une ligue</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="text-accent-300 flex flex-col">
            Nom de la ligue :
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-2 p-2 rounded bg-accent-800 text-white border border-accent-700 focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="Entrez le nom de la ligue"
              required
            />
          </label>

          <div className="text-accent-300">
            <p className="mb-2 font-semibold">Paramètres:</p>
            <div className="flex gap-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={!isPrivate}
                  onChange={() => setIsPrivate(false)}
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Publique</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(true)}
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Privée</span>
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-center">Erreur : {error.message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white py-3 rounded font-semibold transition-colors"
          >
            {loading ? 'Création...' : 'Créer la ligue'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateLeaguePage;
