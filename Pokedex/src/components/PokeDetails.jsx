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


const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DetailsWrapper = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  animation: ${fadeIn} 0.5s ease-out;
`;

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

const TypesContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const TypeBadge = styled.span`
  padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${(props) => typeColors[props.type] || '#777'};
  color: white;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const StatsContainer = styled.div`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  width: 100%;
`;

const StatLabel = styled.span`
  font-weight: bold;
  text-transform: capitalize;
  text-align: right;
  font-size: 0.9rem;
`;

const StatBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`;

const StatProgress = styled.div`
  height: 100%;
  width: ${({ value }) => (value / 255) * 100}%; // Max stat é 255
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: width 0.5s ease-in-out;
  text-align: right;
  padding-right: 5px;
  color: #333;
  font-size: 0.8rem;
  font-weight: bold;
  line-height: 20px;
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