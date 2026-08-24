# EDU-CYBER · Cyber Lab

**Impara a difenderti facendo passare l'attacco vero.** Due host Linux affiancati nel
browser: a sinistra l'attaccante, a destra il difensore, con una LAN isolata in mezzo.

[English version](README.en.md)

## La tesi

Un servizio attivo non dimostra che una difesa funzioni. La prova è l'effetto osservato:
un ban con l'IP reale nel registro, un contatore iptables che cresce, un exploit che prima
funziona e dopo fallisce. Per questo ogni verifica genera un attacco nuovo e legge il
testimone sul difensore; non legge mai la history dell'attaccante né `systemctl is-active`.

Anche lo zero è ambiguo: può voler dire “nessuno ha attaccato” oppure “il filtro è cieco”.
Il lab separa i due casi attaccando e rimisurando. Valori, token e quantità derivano da un
seme non noto allo studente, così la risposta non si può cablare.

## Cosa gira davvero

Il kernel Linux gira in WebAssembly con [v86](https://github.com/copy/v86); i terminali
sono [xterm.js](https://xtermjs.org/). Dentro un solo kernel vivono due network namespace,
`attacker` (`10.10.0.1`) e `defender` (`10.10.0.2`), collegati da una coppia veth. Hanno
pile di rete e utenti distinti, ma condividono kernel e disco: sono due host reali, non due
computer separati, e il capitolo 1 lo dichiara.

Il sito è statico, bilingue IT/EN, senza CDN, dipendenze runtime o build del frontend. Il
mondo nasce nello snapshot; `ttyS0` e `ttyS2` alimentano i terminali visibili, `ttyS1` è il
canale di verifica isolato.

## Sicurezza

È materiale per un laboratorio isolato. La VM non ha route predefinita e gli helper
offensivi accettano solo il bersaglio interno fisso `10.10.0.2`, con raffiche limitate.
Non usare tecniche o payload contro sistemi senza autorizzazione.

## Programma

| | Capitolo |
|---:|---|
| 01 | Le due macchine e la superficie d'attacco |
| 02 | Il servizio che non sapevi di avere |
| 03 | Filtrare a mano: il contatore |
| 04 | Le tre fasce: pubblico, interno, mai |
| 05 | La raffica |
| 06 | Fail2ban: il ban è la prova |
| 07 | Il filtro cieco |
| 08 | Web/PHP: XSS riflesso |
| 09 | Web/PHP: path traversal |
| 10 | Web/PHP: esecuzione di comandi |
| 11 | Chi è il testimone credibile |

Mail con SPF/DKIM/DMARC e la trappola Docker/`FORWARD` richiedono il plugin QEMU e non
sono inclusi nel browser.

## Avvio locale

```bash
npm run image       # costruisce rootfs e snapshot; richiede Docker e zstd
npm run serve       # http://localhost:8803
npm test            # struttura e contenuti bilingui
npm run test:labs   # ogni esercizio nella VM vera, su tre semi
```

Altri banchi: `npm run e2e`, `npm run test:intestazione`, `npm run test:regressione`.
I capitoli sono leggibili anche prima di costruire l'immagine; senza immagine non partono
soltanto le macchine.

La copertura esatta di ogni verde è in [BACKLOG.md](BACKLOG.md); decisioni e guasti già
pagati sono in [STATO.md](STATO.md).

## Licenza

MIT © Andrea Manzi (manzolo). Software ridistribuito e licenze in
[THIRD-PARTY.md](THIRD-PARTY.md).
