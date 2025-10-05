export default function PokeList({ onPick }) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [type, setType] = useState(null);
  const [types, setTypes] = useState([]);
  const [data, setData] = useState({ items: [], totalPages: 1, total: 0 });

  useEffect(() => {
    getTypes().then(setTypes).catch(console.error);
  }, []);

  useEffect(() => {
    listPokemons({ page, pageSize, search, type, withDetails: true })
      .then(setData)
      .catch(console.error);
  }, [page, pageSize, search, type]);

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