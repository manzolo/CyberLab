// Tutti e undici i capitoli browser sono presenti. Docker/FORWARD e posta
// restano intenzionalmente nel plugin qlab: dichiararli qui sarebbe promettere
// un isolamento e un kernel che v86 non offre.
export const CAPITOLI = Array.from({ length: 11 }, (_, i) => {
    const num = i + 1;
    const id = `ch${String(num).padStart(2, "0")}`;
    return { id, num, carica: () => import(`./${id}/chapter.js`) };
});

export const IN_ARRIVO = [];
const cache = new Map();

export async function capitolo(id) {
    if (cache.has(id)) return cache.get(id);
    const voce = CAPITOLI.find(c => c.id === id);
    if (!voce) throw new Error(`capitolo sconosciuto: ${id}`);
    const mod = await voce.carica();
    const cap = { ...voce, ...mod.default };
    cache.set(id, cap);
    return cap;
}

export const primoCapitolo = () => CAPITOLI[0].id;
