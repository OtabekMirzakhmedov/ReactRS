import { useNavigate, useSearchParams } from 'react-router-dom';

export function usePokemonNavigation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const hasDetails = Boolean(searchParams.get('details'));

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(nextPage));
    params.delete('details');
    navigate(`?${params.toString()}`);
  };

  return { page, hasDetails, goToPage };
}
