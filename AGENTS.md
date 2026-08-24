# AGENTS.md

Punto d'ingresso per chi lavora su **EDU-CYBER · Cyber Lab**.

## Prima di modificare

1. Leggi [`STATO.md`](STATO.md): architettura, misure e guasti già pagati.
2. Leggi [`BACKLOG.md`](BACKLOG.md): l'invariante misurabile di ogni esercizio.
3. Per il motore confronta il fratello `../SshLab`; non semplificare snapshot, tre UART,
   namespace UTS/rete o coda seriale senza una misura che giustifichi il cambiamento.

## Contratto del progetto

- Un kernel Linux reale in v86, due host (`attacker` e `defender`) in network namespace
  distinti, collegati soltanto da una veth; `ttyS0` e `ttyS2` sono visibili, `ttyS1` è
  il canale di verifica isolato.
- Sito statico IT/EN, nessuna dipendenza npm a runtime, nessuna build del frontend,
  nessuna CDN. Tutti i contenuti rivolti allo studente esistono in `it` e `en`.
- Il laboratorio è chiuso nella LAN `10.10.0.0/24` e non ha route predefinita. Gli helper
  offensivi accettano solo il bersaglio fisso `10.10.0.2` e volumi piccoli.
- Il check lancia un attacco reale e misura l'effetto sul difensore. Non legge la history,
  non cerca il comando digitato e non considera mai “servizio attivo” una prova.
- Ogni valore variabile deriva da `$EDU_SEED`. Ogni esercizio ha `seed.sh`, `check.sh`,
  `solution.sh`, `cheat.sh`; la soluzione passa su tre semi e il trucco fallisce.
- Un verde vale solo per gli invarianti dichiarati. Il capitolo 6 documenta esplicitamente
  il ponte verso l'API `attempt` di Fail2ban; il filtro è collaudato separatamente nel 7.

## Comandi

```bash
npm run serve       # http://localhost:8803
npm run image       # rootfs + snapshot; richiede Docker e zstd
npm test            # struttura, bilinguismo, opzioni v86
npm run test:labs   # VM vera, infrastruttura e ogni esercizio su tre semi
npm run e2e         # smoke browser; richiede `npm run serve`
npm run test:intestazione
npm run test:regressione
```

Le opzioni v86 sono duplicate nei punti controllati da `tests/opzioni.test.js`: vanno
cambiate insieme. Non pubblicare dal repository durante lo sviluppo locale.
