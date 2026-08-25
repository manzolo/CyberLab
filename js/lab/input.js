// xterm racchiude un incolla fra questi marcatori quando il guest dichiara il
// supporto al bracketed paste. Nello snapshot v86 readline e il terminale possono
// pero' perdere la sincronizzazione: bash riceve allora i marcatori come testo e
// il comando diventa `^[[200~sudo ... REJECT~`.
//
// Li togliamo prima della UART. Se il testo incollato contiene piu' righe, le
// uniamo: un incolla non deve eseguire comandi multipli senza un Invio esplicito.
const APERTURA_INCOLLA = "\x1b[200~";
const CHIUSURA_INCOLLA = "\x1b[201~";

export function normalizzaInputTerminale(dati) {
    if (!dati.startsWith(APERTURA_INCOLLA) || !dati.endsWith(CHIUSURA_INCOLLA)) return dati;
    return dati
        .slice(APERTURA_INCOLLA.length, -CHIUSURA_INCOLLA.length)
        .replace(/[\r\n]+/g, " ");
}
