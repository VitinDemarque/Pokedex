import { useState } from "react";
import styled from "styled-components";
import PokeList from "../components/PokeList";
import { PokeDetails } from "../components/PokeDetails";

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