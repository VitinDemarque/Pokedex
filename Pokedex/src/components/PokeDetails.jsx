import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getPokemon } from '../http/pokeapi';

const typeColors = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD',
};

const PokemonImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4));
`;

const PokemonName = styled.h2`
  font-size: 2rem;
  text-transform: capitalize;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
`;

export function PokeDetails({ idOrName = 'pikachu' }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPokemon(idOrName)
      .then(setPokemon)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [idOrName]);

  if (loading) return <p>Carregando...</p>;
  if (!pokemon) return <p>Pokémon não encontrado.</p>;

  return (
    <DetailsWrapper>
      <PokemonImage
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
      />
      <PokemonName>#{String(pokemon.id).padStart(3, '0')} — {pokemon.name}</PokemonName>
      <TypesContainer>
        {pokemon.types.map(({ type }) => <TypeBadge key={type.name} type={type.name}>{type.name}</TypeBadge>)}
      </TypesContainer>

      <StatsContainer>
        {pokemon.stats.map(({ stat, base_stat }) => (
          <StatRow key={stat.name}>
            <StatLabel>{stat.name.replace('-', ' ')}</StatLabel>
            <StatBar>
              <StatProgress value={base_stat}>{base_stat}</StatProgress>
            </StatBar>
          </StatRow>
        ))}
      </StatsContainer>
    </DetailsWrapper>
  );
}