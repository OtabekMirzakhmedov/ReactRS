import { fetchPokemonByName, fetchPokemonList } from './pokemonService';

const makeFetchResponse = (ok: boolean, data: unknown, status = 200): Response =>
  ({
    ok,
    status,
    json: async () => data,
  }) as Response;

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('pokemonService', () => {
  describe('fetchPokemonByName', () => {
    it('returns a formatted PokemonCard array on success', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        makeFetchResponse(true, {
          id: 25,
          name: 'pikachu',
          types: [{ slot: 1, type: { name: 'electric', url: '' } }],
        })
      );
      const result = await fetchPokemonByName('pikachu');
      expect(result).toEqual([{ name: 'Pikachu', description: 'Types: electric' }]);
    });

    it('capitalizes name and joins multiple types', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        makeFetchResponse(true, {
          id: 1,
          name: 'bulbasaur',
          types: [
            { slot: 1, type: { name: 'grass', url: '' } },
            { slot: 2, type: { name: 'poison', url: '' } },
          ],
        })
      );
      const result = await fetchPokemonByName('bulbasaur');
      expect(result[0].name).toBe('Bulbasaur');
      expect(result[0].description).toBe('Types: grass, poison');
    });

    it('throws when pokemon is not found', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(makeFetchResponse(false, null, 404));
      await expect(fetchPokemonByName('unknown')).rejects.toThrow(
        'Pokémon "unknown" not found (404)'
      );
    });
  });

  describe('fetchPokemonList', () => {
    it('returns a formatted list of PokemonCards on success', async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce(
          makeFetchResponse(true, { count: 1, results: [{ name: 'pikachu', url: '' }] })
        )
        .mockResolvedValueOnce(
          makeFetchResponse(true, {
            id: 25,
            name: 'pikachu',
            types: [{ slot: 1, type: { name: 'electric', url: '' } }],
          })
        );
      const result = await fetchPokemonList();
      expect(result.pokemons).toEqual([{ name: 'Pikachu', description: 'Types: electric' }]);
      expect(result.total).toBe(1);
    });

    it('throws when the list fetch fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(makeFetchResponse(false, null, 500));
      await expect(fetchPokemonList()).rejects.toThrow('Failed to fetch Pokémon list (500)');
    });

    it('throws when an individual pokemon detail fetch fails', async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce(
          makeFetchResponse(true, { results: [{ name: 'pikachu', url: '' }] })
        )
        .mockResolvedValueOnce(makeFetchResponse(false, null, 404));
      await expect(fetchPokemonList()).rejects.toThrow('Failed to fetch pikachu');
    });
  });
});
