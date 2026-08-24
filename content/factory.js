// Stampo editoriale comune: mantiene identica la cadenza della collana senza
// nascondere il contenuto dei singoli capitoli. Ogni testo rivolto a chi studia
// arriva come coppia {it,en}; i test rifiutano un lato mancante.
export function creaCapitolo({
    id, num, title, oneLiner, commands, glossary, hook, lead, analogy,
    shown, pitfalls, pro, exercise, recap, requires = [],
}) {
    return {
        id, num, draft: false, title, oneLiner, commands, glossary, requires,
        blocks: [
            { kind: "hook", html: hook },
            { kind: "lead", html: lead },
            { kind: "analogy", html: analogy },
            { kind: "shown", lines: shown },
            { kind: "pitfalls", items: pitfalls },
            { kind: "pro", html: pro },
            { kind: "lab" },
            { kind: "recap", table: recap },
        ],
        exercises: [{ id: "e1", tipo: exercise.tipo || "stato", ...exercise }],
    };
}

export const check = (id, whyIt, whyEn, nudgeIt, nudgeEn) => ({
    id,
    why: { it: whyIt, en: whyEn },
    nudge: { it: nudgeIt, en: nudgeEn },
});

export const riga = (cmd, it, en, flagIt = "", flagEn = "") => ({
    cmd,
    what: { it, en },
    flag: { it: flagIt || "—", en: flagEn || "—" },
});
