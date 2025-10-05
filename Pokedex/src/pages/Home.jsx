import { useState } from "react";
import styled from "styled-components";
import PokeList from "../components/PokeList";
import { PokeDetails } from "../components/PokeDetails";

const Grid = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(4)};
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); // Colunas mais flexíveis
  gap: ${({ theme }) => theme.spacing(4)};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing(4)};
  min-height: 400px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden; // Garante que o conteúdo não vaze
`;

const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing(4)} 0;
  font-weight: 700;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const PlaceholderText = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
`;

export default function Home() {
  const [selected, setSelected] = useState(null);

  return (
    <Grid>
      <Panel>
        <Title>Pokédex</Title>
        <PokeList onPick={(name) => setSelected(name)} />
      </Panel>

      <Panel>
        <Title>Detalhes</Title>
        {selected ? (
          <PokeDetails idOrName={selected} />
        ) : (
          <PlaceholderText>Selecione um Pokémon para ver os detalhes</PlaceholderText>
        )}
      </Panel>
    </Grid>
  );
}