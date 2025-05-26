import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PILOTES,
  GET_MY_BETS,
  GET_GP,
} from '../graphql/queries';
import {
  CREATE_BET_SELECTION,
  UPDATE_BET_SELECTION,
  DELETE_BET_SELECTION,
} from '../graphql/mutations';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

const BetPage: React.FC = () => {
  const { gpId } = useParams<{ gpId: string }>();
  const navigate = useNavigate();
  const [selectedP10, setSelectedP10] = useState<number | null>(null);
  const [selectedDNF, setSelectedDNF] = useState<number | null>(null);
  const [existingBet, setExistingBet] = useState<any>(null);

  const { data: pilotesData } = useQuery(GET_PILOTES);
  const { data: myBetsData, refetch: refetchBets } = useQuery(GET_MY_BETS);
  const { data: gpData, loading: loadingGP } = useQuery(GET_GP, {
    variables: { id: gpId },
    skip: !gpId,
  });

  const [createBet] = useMutation(CREATE_BET_SELECTION);
  const [updateBet] = useMutation(UPDATE_BET_SELECTION);
  const [deleteBet] = useMutation(DELETE_BET_SELECTION);

  useEffect(() => {
    if (myBetsData?.getMyBets && gpId) {
      const existing = myBetsData.getMyBets.find(
        (b: any) => b.gp.id_api_races === gpId
      );
      if (existing) {
        setExistingBet(existing);
        setSelectedP10(existing.pilote_p10.id_api_pilotes);
        setSelectedDNF(existing.pilote_dnf.id_api_pilotes);
      }
    }
  }, [myBetsData, gpId]);

  const handleSubmit = async () => {
    if (!selectedP10 || !selectedDNF || !gpId) return;

    try {
      if (existingBet) {
        await updateBet({
          variables: {
            betId: existingBet.id,
            piloteP10Id: selectedP10,
            piloteDNFId: selectedDNF,
          },
        });
        alert('Pari mis à jour.');
      } else {
        await createBet({
          variables: {
            gpId: gpId,
            piloteP10Id: selectedP10,
            piloteDNFId: selectedDNF,
          },
        });
        alert('Pari créé.');
      }
      refetchBets();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!existingBet) return;
    if (!confirm('Supprimer ce pari ?')) return;

    try {
      await deleteBet({ variables: { betId: existingBet.id } });
      setExistingBet(null);
      setSelectedP10(null);
      setSelectedDNF(null);
      refetchBets();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8 px-4">
        <h1 className="text-2xl text-white font-bold mb-6">
          {loadingGP ? (
            'Chargement...'
          ) : gpData?.gp?.track ? (
            <>Parier sur le GP de {gpData.gp.track.country_name} — {gpData.gp.track.track_name}</>
          ) : (
            `Parier sur le Grand Prix #${gpId}`
          )}
        </h1>

        <div className="space-y-4">
          <Select
            label="Pilote en P10"
            options={
              pilotesData?.pilotes.map((p: any) => ({
                value: p.id_api_pilotes,
                label: p.name,
              })) || []
            }
            value={selectedP10 ?? undefined}
            onChange={(e) => setSelectedP10(Number(e.target.value))}
          />

          <Select
            label="Premier DNF"
            options={
              pilotesData?.pilotes.map((p: any) => ({
                value: p.id_api_pilotes,
                label: p.name,
              })) || []
            }
            value={selectedDNF ?? undefined}
            onChange={(e) => setSelectedDNF(Number(e.target.value))}
          />

          <Button onClick={handleSubmit} variant="primary" fullWidth>
            {existingBet ? 'Modifier le pari' : 'Valider le pari'}
          </Button>

          {existingBet && (
            <Button onClick={handleDelete} variant="outline" fullWidth>
              Supprimer le pari
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BetPage;
