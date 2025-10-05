import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getPokemon } from '../http/pokeapi';

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