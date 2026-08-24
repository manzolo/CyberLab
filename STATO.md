# STATO DEL LAVORO

Aggiornato al **2026-08-25**. EDU-CYBER · Cyber Lab contiene il motore browser e gli
undici capitoli previsti. Non è stato pubblicato.

## Architettura misurata

```text
┌────────────── una VM v86, un kernel Linux, 128 MB ──────────────┐
│ attacker / netns default          defender / netns server       │
│ 10.10.0.1 ───── veth-pc ───── veth-srv ───── 10.10.0.2         │
│ ttyS0                                                ttyS2      │
│              ttyS1 = verifica isolata                         │
└─────────────────────────────────────────────────────────────────┘
```

- v86 + xterm.js, sito statico IT/EN, nessuna build frontend e nessuna dipendenza
  runtime.
- Due pile di rete e due utenti veri (`attacker`, `defender`), ma kernel e disco
  condivisi. Il namespace UTS dà al difensore il proprio hostname.
- Nessuna route predefinita: gli strumenti restano nella LAN interna. `cyber-burst`
  può colpire soltanto `10.10.0.2`, da 1 a 20 richieste.
- PHP 8.3 espone bersagli intenzionalmente vulnerabili su 8080/9000; httpd e un listener
  TCP completano le tre zone. iptables, nmap e Fail2ban sono i programmi Alpine reali.
- Lo snapshot nasce dopo rete, servizi, CRNG e warm-up di SSH/Fail2ban. Ultima misura:
  rootfs **87 MB / 5.557 file / 174 pacchetti**; snapshot **22,2 MB** (tetto 25 MB).

## Stato dei banchi

- `npm run image`: verde; rootfs e snapshot prodotti entro i tetti.
- `npm test`: **2/2** file verdi (struttura, bilinguismo, opzioni macchina).
- `npm run test:labs`: **79 asserzioni, 0 problemi**; ch06 mirato dopo
  l'ottimizzazione: **9/9**.
- `npm run e2e`: tutti gli undici cicli iniziale→soluzione nel browser e nessun errore JS.
- `npm run test:intestazione`: IT/EN verdi su **37 larghezze**.
- Regressioni da terminale: azione utente **5/5**, CWD **5/5**, identità **4/4**,
  tastiera **3/3**.

La copertura esatta dei verdi è il contratto in [`BACKLOG.md`](BACKLOG.md). In particolare,
ch06 non finge che il file watcher di v86 funzioni: gli eventi provati nel registro sono
presentati alla API `attempt` del demone; ch07 prova separatamente il parser.

## Dove sta cosa

| Percorso | Responsabilità |
|---|---|
| `content/ch01…ch11/` | capitoli bilingui e quattro script per esercizio |
| `content/index.js` | catalogo degli undici capitoli |
| `js/lab/` | VM, terminali, agente su ttyS1 e runner |
| `lab/overlay/opt/lab/bin/lab-hosts-up` | namespace, veth, UTS e servizi prima dello snapshot |
| `lab/overlay/opt/cyber-lab/app/router.php` | bersaglio PHP e audit del difensore |
| `lab/overlay/opt/lab/lib/labcheck.sh` | primitive che misurano gli invarianti |
| `lab/build-state.mjs` | warm-up e snapshot compresso |
| `tests/infrastruttura.sh` | fatti comuni: isolamento, PHP, firewall e filtri |
| `tests/labs.mjs` | banco multi-seme con soluzione e cheat |

## Guasti già pagati, con il sintomo

Queste non sono preferenze stilistiche. Ogni voce descrive il sintomo osservato che ha
portato alla protezione presente nel codice.

1. **FIFO UART satura** — sullo schermo appariva il comando corretto, ma al guest arrivavano
   byte mancanti o UTF-8 corrotto. La tastiera ora invia piccoli blocchi in coda.
2. **Carriage return nel JSON** — il comando terminava, ma il browser diceva “la verifica
   non ha risposto”: un `\r` grezzo rendeva illegale la risposta ttyS1.
3. **ttyS1 mescolata ai terminali** — editor o output interattivo ingerivano i comandi di
   verifica. Il canale ha una seriale senza getty e non tocca mai ttyS0/ttyS2.
4. **Solo namespace di rete** — entrando sul difensore il prompt diceva ancora
   `defender@attacker`. `/run/lab/entra-server` entra sempre in netns e UTS.
5. **Account Alpine bloccato** — SSH rispondeva soltanto `Permission denied`, anche con
   chiave corretta. La build imposta una password hash e verifica `/etc/shadow`.
6. **CRNG senza entropia** — `ssh-keygen` restava fermo senza output. Lo snapshot viene
   salvato solo dopo una lettura bloccante da `/dev/random`.
7. **Primo SSH dal 9p** — il primo login superava tre minuti, i successivi duravano circa
   otto secondi. `lab-scalda-ssh` paga le letture una volta durante la build.
8. **RSA a runtime** — generare RSA-4096 sulla CPU emulata sembrava un blocco di minuti.
   Le chiavi non didattiche sono generate durante la build su CPU host.
9. **`ssh` attaccato allo stdin** — il comando remoto finiva, ma il check non tornava.
   Le sonde non interattive chiudono lo stdin (`-n`/`BatchMode=yes`).
10. **Hostname scritto nel file sbagliato** — Alpine ripristinava `localhost` al boot;
    serviva anche `/etc/conf.d/hostname`.
11. **ResizeObserver autoalimentato** — ridimensionare xterm generava una tempesta di
    `stty` e faceva scadere le verifiche vere. Si osserva il contenitore, con guardie.
12. **Griglia larga migliaia di pixel** — la traccia CSS implicita cresceva fino alle 80
    colonne di xterm. Le celle hanno `min-width:0` e breakpoint espliciti.
13. **Tre scroll concorrenti e rotellina catturata** — la lettura si spezzava e la pagina
    non scorreva sopra i terminali. Scorre solo il documento; mouse v86 è disabilitato.
14. **Collisione localStorage fra lab** — lingua, progresso e seme di SshLab comparivano
    qui. Tutte le chiavi usano il prefisso `cyberlab.`.
15. **Header mobile sovrapposto** — a 390 px “Cyber Lab” finiva sotto i pulsanti. La sigla
    non va a capo, il nome si nasconde sotto 560 px e il banco misura 37 larghezze.
16. **Stato di rete fra esercizi** — un indirizzo seminato restava nel capitolo dopo e i
    comandi documentati rispondevano `Network unreachable`. Ogni seed ripristina rete e ARP.
17. **Applet httpd sbagliato** — PHP e porta 3306 erano attivi, ma 80 e 9090 risultavano
    chiuse: `/bin/busybox` non conteneva quell'applet. Si usa `/usr/sbin/httpd`.
18. **PATH diverso sul canale di verifica** — un helper funzionava nel terminale ma il
    check rispondeva `cyber-burst: not found`. Gli script interni usano percorsi assoluti.
19. **Regex Fail2ban ancorata** — tre attacchi freschi producevano `0 matched`: Fail2ban
    rimuove la data e può lasciare un prefisso, quindi il filtro buono non ancora l'inizio.
20. **Python Fail2ban a freddo** — il check superava 120 secondi prima di produrre un fatto.
    Demone e `fail2ban-regex` vengono letti prima dello snapshot; lo stop usa il PID.
21. **Jail Alpine estranee** — il registro mostrava `sshd` e `sshd-ddos` insieme a
    `cyber-auth`, rendendo ambiguo chi avesse bannato. Un override le disabilita.
22. **Watcher del file cieco in v86** — l'audit cresceva fino a cinque righe mentre il
    poller restava a posizione zero, anche su tmpfs/inotify. ch06 usa la API pubblica
    `attempt` solo dopo aver provato quegli eventi; ch07 misura il filtro sul file.
23. **Ban prima dell'azione** — il log conteneva `Ban 10.10.0.1`, ma una sonda immediata
    entrava ancora: iptables veniva applicato in asincrono. Il check attende e riprova
    l'effetto, non si ferma al registro.

## Limiti e consegna

Mail/SPF/DKIM/DMARC e Docker/`FORWARD` restano nel plugin QEMU: non vanno aggiunti qui.
La revisione manuale, l'integrazione nell'hub Docsify e la pubblicazione su GitHub Pages
sono lasciate intenzionalmente alla sessione finale di Andrea/Claude.
