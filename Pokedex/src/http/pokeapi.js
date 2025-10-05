import axios from "axios";

const api = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/'
});

const cache = {
    pokemon: new Map(),
    type: new Map(),
    ability: new Map(),
    move: new Map(),
    indexAll: null,
}

const parseIdFromUrl = (url) => {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
}

export async function getPokemon(idOrName) {
    const key = String(idOrName).toLowerCase();
    if (cache.pokemon.has(key)) {
        return Promise.resolve(cache.pokemon.get(key));
    }
    const { data } = await api.get(`pokemon/${key}`);
    cache.pokemon.set(key, data);
    cache.pokemon.set(String(data.id), data);
    return data;
}

export async function getTypes() {
    if (cache.type.has('__types__')) return cache.type.get('__types__');
    const { data } = await api.get('type');
    const list = data.results.map((t) => t.name).filter(Boolean);
    cache.type.set('__types__', list);
    return list;
}

export async function listPokemons(options = {}) {
    const {
        page = 1,
        pageSize = 20,
        search = '',
        type = null,
        withDetails = false,
    } = options;

    const normalizedSearch = String(search).trim().toLowerCase();

    if (type) {
        if (!cache.type.has(type)) {
            const {data} = await api.get(`type/${type}`);
            const members = (data.pokemon || []).map((p) => ({
                name: p.pokemon.name,
                url: p.pokemon.url,
                id: parseIdFromUrl(p.pokemon.url)
            }));
            cache.type.set(type, members);
        }
        let list = cache.type.get(type);

        if (normalizedSearch) {
            list = list.filter((p) => p.name.includes(normalizedSearch));
        }

        const total  = list.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const start = (page - 1) * pageSize;
        const itemsPage = list.slice(start, start + pageSize);

        let items = itemsPage;
        if (withDetails) {
            const details = await Promise.all(
                itemsPage.map((p) => getPokemon(p.name))
            );
            items = itemsPage.map((p, i) => ({...p, details: details[i]}));
        }

        return {
            items,
            page,
            pageSize,
            total,
            totalPages,
            filters: {type, search: normalizedSearch}
        };
    }

    if(normalizedSearch) {
        try {
            const exact = await getPokemon(normalizedSearch);
            return {
                items: [{
                    id: exact.id,
                    name: exact.name,
                    url: `https://pokeapi.co/api/v2/pokemon/${exact.id}/`,
                    details: withDetails ? exact : undefined,
                }],
                page: 1,
                pageSize: 1,
                total: 1,
                totalPages: 1,
                filters: { search: normalizedSearch, type: null  }
            }
        } catch {
            // ignora os erros 
        }

        if (!cache.indexAll) {
            const { data } = await api.get('pokemon', {
                params: { limit: 200000, offset: 0 }
            });
            cache.indexAll = data.results.map((p) => ({
                name: p.name,
                url: p.url,
                id: parseIdFromUrl(p.url),
            }));
        }
        const filtered = cache.indexAll.filter((p) => p.name.includes(normalizedSearch))
        const total  = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        const start = (page - 1) * pageSize;
        const itemsPage = filtered.slice(start, start + pageSize);
        let items = itemsPage;
        if (withDetails) {
            const details = await Promise.all(
                itemsPage.map((p) => getPokemon(p.name))
            );
            items = itemsPage.map((p, i) => ({...p, details: details[i]}));
        }

        return {
            items,
            page,
            pageSize,
            total,
            totalPages,
            filter: {search: normalizedSearch, type: null}
        }
    }

    const offset = (page - 1) * pageSize;
    const { data } = await api.get('pokemon', {
        params: { limit: pageSize, offset },
    });
    let items = data.results.map((p) => ({
        name: p.name,
        url: p.url,
        id: parseIdFromUrl(p.url),
    }));

    if (withDetails) {
        const details = await Promise.all(
            items.map((p) => getPokemon(p.name))
        );
        items = items.map((p, i) => ({...p, details: details[i]}));
    }

    return {
        items,
        page,
        pageSize,
        total: data.count,
        totalPages: Math.max(1, Math.ceil(data.count / pageSize)),
        filter: { search: '', type: null  }
    }
}