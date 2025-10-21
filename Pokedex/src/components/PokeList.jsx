import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { listPokemons, getTypes } from '../http/pokeapi';


const ControlsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled(Input).attrs({ as: 'select' })`
  cursor: pointer;
`;

const ListGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing(2)};
  max-height: 65vh;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing(1)};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: ${({ theme }) => theme.radius.md};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.radius.md};
  }
`;

const Card = styled.li`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing(2)};
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px ${({ theme }) => theme.colors.primary}77;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: contain;
`;

const CardTitle = styled.strong`
  display: block;
  margin-top: ${({ theme }) => theme.spacing(1)};
  text-transform: capitalize;
`;

const PaginationContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const PageButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: #ffde59;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray};
    cursor: not-allowed;
    opacity: 0.5;
  }
`;


export default function PokeList({ onPick, onLoading }) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [type, setType] = useState(null);
  const [types, setTypes] = useState([]);
  const [data, setData] = useState({ items: [], totalPages: 1, total: 0 });

  useEffect(() => {
    onLoading?.(true);
    getTypes()
      .then(setTypes)
      .catch(console.error)
      .finally(() => onLoading?.(false));
  }, [onLoading]);

  useEffect(() => {
    onLoading?.(true);
    listPokemons({ page, pageSize, search, type, withDetails: true })
      .then(setData)
      .catch(console.error)
      .finally(() => onLoading?.(false));
  }, [page, pageSize, search, type, onLoading]);

  const handlePick = (name) => {
    if (onPick) onPick(name);
  }

  return (
    <>
      <ControlsContainer>
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Select
          value={type || ''}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value || null);
          }}
        >
          <option value="">Todos os tipos</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </ControlsContainer>

      <ListGrid>
        {data.items.map((p) => (
          <Card
            key={p.id}
            onClick={() => handlePick(p.name)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePick(p.name); }}
            role="button"
            tabIndex={0}
            title={`Ver detalhes de ${p.name}`}
          >
            {p.details?.sprites?.other?.['official-artwork']?.front_default && (
              <CardImage
                src={p.details.sprites.other['official-artwork'].front_default}
                alt={p.name}
                loading="lazy"
              />
            )}
            <CardTitle>#{String(p.id).padStart(3, '0')} — {p.name}</CardTitle>
          </Card>
        ))}
      </ListGrid>

      <PaginationContainer>
        <PageButton disabled={page === 1} onClick={() => setPage((n) => n - 1)}>
          Anterior
        </PageButton>
        <span>
          Página {page} de {data.totalPages}
        </span>
        <PageButton disabled={page === data.totalPages} onClick={() => setPage((n) => n + 1)}>
          Próxima
        </PageButton>
      </PaginationContainer>
    </>
  );
}