import { creaCapitolo, check, riga } from "../factory.js";

export default creaCapitolo({
    id: "ch01", num: 1,
    title: { it: "Le due macchine e la superficie d'attacco", en: "Two machines and the attack surface" },
    oneLiner: { it: "Prima di difendere bisogna sapere quali porte rispondono davvero.", en: "Before defending, find out which ports really answer." },
    commands: ["ip -4 addr", "ss -tln", "nmap -sT", "curl"],
    glossary: ["superficie d'attacco", "porta TCP", "sonda", "network namespace"],
    hook: {
        it: "Una porta dimenticata non deve essere violata: basta che qualcuno la trovi. La prima difesa è vedere il sistema con gli occhi di chi sta dall'altra parte.",
        en: "A forgotten port does not need to be broken into: somebody only has to find it. The first defense is seeing the system through the other side's eyes.",
    },
    lead: {
        it: "A sinistra c'è <strong>attacker</strong> (<code>10.10.0.1</code>), a destra <strong>defender</strong> (<code>10.10.0.2</code>). Sono due pile di rete Linux collegate da una <code>veth</code>. Le sonde partono davvero dalla prima e raggiungono davvero i socket della seconda.",
        en: "On the left is <strong>attacker</strong> (<code>10.10.0.1</code>), on the right <strong>defender</strong> (<code>10.10.0.2</code>). They are two Linux network stacks connected by a <code>veth</code>. Probes really leave the first and reach sockets on the second.",
    },
    analogy: {
        it: "L'indirizzo IP è il palazzo; le porte sono ingressi. L'inventario visto dall'interno (<code>ss</code>) e quello provato dalla strada (<code>nmap</code>) rispondono a domande diverse.",
        en: "The IP address is the building; ports are entrances. The inside inventory (<code>ss</code>) and the one tested from the street (<code>nmap</code>) answer different questions.",
    },
    shown: [
        { cmd: "nmap -sT -p 22,80,3306,8080,9000,9090 10.10.0.2", out: "PORT     STATE SERVICE\n80/tcp   open  http\n8080/tcp open  http-proxy", note: { it: "È una misura dalla macchina attaccante, non una promessa di configurazione.", en: "This is a measurement from the attacker, not a configuration promise." } },
        { cmd: "ss -tln", out: "LISTEN 0 4096 10.10.0.2:8080", note: { it: "Sul difensore spiega chi ascolta, non se il percorso è aperto.", en: "On the defender it explains who listens, not whether the path is open." } },
    ],
    pitfalls: [
        { it: "<strong>Materiale per un lab isolato.</strong> Qui non si scansionano Internet, reti scolastiche o sistemi altrui. La VM non ha una route esterna e gli helper hanno il bersaglio interno fisso. Fuori da qui serve autorizzazione esplicita.", en: "<strong>Material for an isolated lab.</strong> Do not scan the Internet, school networks, or other people's systems. This VM has no external route and helpers have a fixed internal target. Outside this lab you need explicit permission." },
        { it: "<strong>Una porta chiusa non prova che il servizio sia spento.</strong> Potrebbe ascoltare solo su loopback o essere filtrato. Scrivi sempre che cosa hai misurato.", en: "<strong>A closed port does not prove the service is stopped.</strong> It may listen only on loopback or be filtered. Always state what you measured." },
    ],
    pro: {
        it: "<p>Onestà sul modello: non sono due computer fisici. Condividono kernel, disco e processi; hanno utenti, UTS e pile di rete distinti. È la stessa separazione di base dei container. È sufficiente per misurare IP sorgente, socket, log e firewall; non è sufficiente per Docker/FORWARD o posta, che restano su qlab.</p>",
        en: "<p>Being honest about the model: these are not two physical computers. They share a kernel, disk, and process table; users, UTS names, and network stacks are separate. This is the same basic separation used by containers. It is enough to measure source IP, sockets, logs, and firewalls; it is not enough for Docker/FORWARD or mail, which remain in qlab.</p>",
    },
    exercise: {
        tipo: "stato",
        brief: { it: "Da <strong>attacker</strong> esegui una scansione TCP delle sei porte indicate e salva il risultato in <code>~/lab/scan.txt</code>. La prova deve arrivare davvero al difensore.", en: "From <strong>attacker</strong>, run a TCP scan of the six listed ports and save the result to <code>~/lab/scan.txt</code>. The probe must really reach the defender." },
        come: [
            { dove: "pc", testo: { it: "Scansiona solo il bersaglio interno e conserva il referto:", en: "Scan only the internal target and keep the report:" }, cmd: "nmap -sT -p 22,80,3306,8080,9000,9090 10.10.0.2 | tee ~/lab/scan.txt" },
            { dove: "server", testo: { it: "Confronta dall'interno:", en: "Compare from the inside:" }, cmd: "sudo ss -tln" },
        ],
        nota: { it: "La verifica legge il referto, ricava le porte attualmente in ascolto e pretende anche una connessione registrata dal servizio PHP. Un file inventato non basta.", en: "The check reads the report, derives currently listening ports, and also requires a connection logged by the PHP service. A fabricated file is not enough." },
        checks: [
            check("porte-elencate", "Il referto non elenca tutte le porte realmente aperte.", "The report does not list every port that is actually open.", "Ripeti la scansione con <code>-sT</code> e le sei porte della consegna.", "Repeat the scan with <code>-sT</code> and the six assigned ports."),
            check("sonda-arrivata", "Nel registro del difensore non compare l'IP dell'attaccante.", "The defender log does not contain the attacker's IP.", "Prova anche <code>curl http://10.10.0.2:8080/health</code>, poi rifai la scansione.", "Also try <code>curl http://10.10.0.2:8080/health</code>, then scan again."),
        ],
        hints: [
            { it: "<code>-sT</code> apre connessioni TCP complete: il difensore può vederle.", en: "<code>-sT</code> opens full TCP connections: the defender can see them." },
            { it: "Il file deve contenere righe <code>porta/tcp open</code>, non soltanto il comando.", en: "The file must contain <code>port/tcp open</code> lines, not just the command." },
        ],
    },
    recap: [
        riga("nmap -sT", "misura porte raggiungibili dalla rete", "measure ports reachable from the network", "bersaglio fisso: 10.10.0.2", "fixed target: 10.10.0.2"),
        riga("ss -tln", "elenca socket in ascolto localmente", "list locally listening sockets", "non prova il percorso", "does not prove the path"),
    ],
});
