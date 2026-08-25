import { creaCapitolo, check, riga } from "../factory.js";

export default creaCapitolo({
    id: "ch02", num: 2, requires: ["ch01"],
    title: { it: "Il servizio che non sapevi di avere", en: "The service you did not know you had" },
    oneLiner: { it: "Raggiungibile e senza autenticazione significa scrivibile da chiunque sulla rete.", en: "Reachable and unauthenticated means writable by anyone on the network." },
    commands: ["curl -X POST", "base64", "tail"], glossary: ["autenticazione", "integrità", "audit log"],
    hook: { it: "Un banner innocuo può nascondere un'operazione di scrittura. La domanda non è «che software è?», ma «che cosa mi lascia fare senza identità?».", en: "An innocent banner may hide a write operation. The question is not “what software is it?” but “what can it let me do without an identity?”" },
    lead: { it: "Il servizio su <code>:9000</code> accetta un corpo HTTP e lo conserva. Il seme crea un valore diverso per ogni mondo: soltanto la scrittura arrivata via rete può produrre insieme dato e riga di audit corretti.", en: "The service on <code>:9000</code> accepts an HTTP body and stores it. The seed creates a different value for every world: only a write arriving over the network can produce both the correct data and audit line." },
    analogy: { it: "Una serranda aperta non è il problema se dietro c'è una vetrina; lo diventa se dietro c'è il magazzino e nessuno chiede il badge.", en: "An open shutter is not the issue if there is a window behind it; it is if there is a warehouse and nobody asks for a badge." },
    shown: [
        { cmd: "curl -X POST --data 'prova' http://10.10.0.2:9000/store", out: "STORED", note: { it: "La risposta viene dal servizio del difensore.", en: "The response comes from the defender service." } },
        { cmd: "sudo tail /var/log/cyber-lab/audit.log", out: "STORE ip=10.10.0.1 value=...", note: { it: "Il testimone conserva l'IP sorgente vero.", en: "The witness keeps the real source IP." } },
    ],
    pitfalls: [
        { it: "<strong>Scrivere il file dal terminale destro non è un attacco.</strong> Dimostra solo che l'amministratore ha accesso al disco.", en: "<strong>Writing the file from the right terminal is not an attack.</strong> It only proves the administrator has disk access." },
        { it: "Un <code>200</code> da solo non prova la persistenza: si controllano contenuto e audit.", en: "A <code>200</code> alone does not prove persistence: check content and audit." },
    ],
    pro: { it: "<p>Il valore nel registro è codificato Base64 per tenere una riga per evento, non per proteggerlo. Base64 è una rappresentazione, non cifratura.</p>", en: "<p>The value in the log is Base64-encoded to keep one line per event, not to protect it. Base64 is a representation, not encryption.</p>" },
    exercise: {
        brief: { it: "Leggi <code>~/lab/token.txt</code> sull'attaccante e invialo con POST al servizio <code>:9000/store</code>, senza usare il terminale del difensore.", en: "Read <code>~/lab/token.txt</code> on the attacker and POST it to <code>:9000/store</code>, without using the defender terminal." },
        come: [{ dove: "pc", testo: { it: "Invia il contenuto esatto:", en: "Send the exact content:" }, cmd: "curl -X POST --data-binary @$HOME/lab/token.txt http://10.10.0.2:9000/store" }],
        nota: { it: "Il check pretende il token seminato nel magazzino e una riga del difensore con <code>ip=10.10.0.1</code>.", en: "The check requires the seeded token in storage and a defender record with <code>ip=10.10.0.1</code>." },
        checks: [
            check("scrittura-remota", "Nel magazzino non c'è il token di questo mondo.", "This world's token is not in storage.", "Usa <code>--data-binary @file</code> per non cambiare il contenuto.", "Use <code>--data-binary @file</code> so the content is unchanged."),
            check("ip-nel-registro", "Manca la prova che la scrittura sia arrivata dall'attaccante.", "There is no proof the write arrived from the attacker.", "Sul difensore guarda <code>/var/log/cyber-lab/audit.log</code>.", "On the defender inspect <code>/var/log/cyber-lab/audit.log</code>."),
        ],
        hints: [{ it: "Il file del token è sulla macchina sinistra.", en: "The token file is on the left machine." }, { it: "Non copiare il token a mano: <code>@percorso</code> fa leggere il corpo a curl. Dopo <code>@</code> usa <code>$HOME</code>: in <code>@~/...</code> la shell non espande la tilde.", en: "Do not copy the token by hand: <code>@path</code> makes curl read the body. After <code>@</code>, use <code>$HOME</code>: the shell does not expand the tilde in <code>@~/...</code>." }],
    },
    recap: [riga("curl -X POST", "esegue una scrittura HTTP reale", "perform a real HTTP write", "--data-binary @file", "--data-binary @file"), riga("audit.log", "dice chi ha scritto", "states who wrote", "testimone lato difensore", "defender-side witness")],
});
