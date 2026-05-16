import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PokemonDetail } from '../types/pokemon';
import { fetchPokemonDetail } from '../services/pokemonService';
import Loader from './Loader';

export default function DetailPanel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pokemonName = searchParams.get('details');

  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemonName) return;
    setLoading(true);
    setError(null);
    fetchPokemonDetail(pokemonName)
      .then(setDetail)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load');
      })
      .finally(() => setLoading(false));
  }, [pokemonName]);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('details');
    navigate(`?${params.toString()}`);
  };

  if (!pokemonName) return null;

  return (
    <div className="detail-panel">
      <button className="detail-close" onClick={handleClose}>
        &times;
      </button>
      {loading && <Loader />}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && detail && (
        <div className="detail-content">
          <h2>{detail.name.charAt(0).toUpperCase() + detail.name.slice(1)}</h2>
          <p>
            <strong>ID:</strong> #{detail.id}
          </p>
          <p>
            <strong>Types:</strong> {detail.types.map((t) => t.type.name).join(', ')}
          </p>
          <p>
            <strong>Height:</strong> {detail.height / 10} m
          </p>
          <p>
            <strong>Weight:</strong> {detail.weight / 10} kg
          </p>
          <p>
            <strong>Base XP:</strong> {detail.base_experience}
          </p>
          <h3>Stats</h3>
          <ul className="detail-stats">
            {detail.stats.map((s) => (
              <li key={s.stat.name}>
                <span>{s.stat.name}</span>
                <span>{s.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
