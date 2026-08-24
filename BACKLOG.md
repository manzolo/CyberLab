# BACKLOG — contratto misurabile degli esercizi

Stato al **2026-08-25**: motore e capitoli 1–11 implementati. Questo file conserva la
parte difficile del progetto: cosa deve essere vero perché un esercizio sia verde.

## Regola comune

Ogni check genera uno stimolo nuovo, dal lato attaccante, e legge il testimone sul
difensore. Uno zero viene interpretato soltanto dopo lo stimolo: senza attacco non distingue
“nessun evento” da “sensore cieco”. La forma del comando non è mai un invariante.

| Cap. | Invariante misurabile | Trucco che deve fallire |
|---:|---|---|
| 1 | Una scansione reale trova le porte seminate e il registro del difensore contiene la sonda `HEALTH` proveniente dall'IP reale dell'attaccante. | Scrivere un rapporto di scansione finto. |
| 2 | Una POST non autenticata con token seminato modifica lo store del difensore; l'audit contiene valore e `10.10.0.1`. | Scrivere direttamente nel file condiviso. |
| 3 | Dopo una sonda baseline, la stessa sonda è bloccata da `EDU-GUARD` e il contatore pacchetti della regola cresce. | Spegnere il servizio. |
| 4 | Porta pubblica raggiungibile; porta interna raggiungibile solo dall'alias sorgente seminato; sorgente normale e porta “mai” respinte mentre i servizi restano vivi. | Spegnere i listener. |
| 5 | Una raffica reale produce esattamente N righe col token seminato nel registro del difensore e una sonda di controllo aggiunge una riga. | Falsificare un log sul lato attaccante. |
| 6 | Cinque eventi reali sono attestati dal difensore; Fail2ban registra `Ban 10.10.0.1`; una nuova connessione dalla stessa sorgente fallisce. | Creare un file “active”. |
| 7 | Sullo stesso registro generato al momento, il filtro cieco misura 0/N e quello corretto N/N; l'esercizio passa solo quando il filtro bersaglio misura N. | Scrivere “N matched” in un file. |
| 8 | L'XSS riflesso esegue prima della modifica; dopo, la risposta contiene la codifica HTML e non contiene più il payload eseguibile. | Salvare una risposta finta. |
| 9 | Il traversal legge prima il segreto seminato; dopo restituisce 403 e il segreto non appare. | Cancellare o rinominare il segreto. |
| 10 | L'endpoint esegue prima un comando con marker seminato; dopo restituisce 403 e nessun output del comando. | Alterare soltanto l'output locale. |
| 11 | Il registro del difensore conserva marker e IP reali anche dopo la pulizia della history dell'attaccante; una sonda di controllo attraversa ancora la pipeline. | Scrivere il marker nella history o in un file locale. |

## Copertura onesta di ch06

v86 non consegna in modo affidabile a Fail2ban le notifiche di append del filesystem.
Il check conta quindi gli eventi reali nel registro del difensore e li presenta in una sola
operazione alla API pubblica `fail2ban-client set … attempt`. Restano reali e misurati:
`maxretry`, registro del ban, IP sorgente, catena iptables e fallimento della sonda dopo il
ban. Il parsing del registro non è attribuito a quel verde: è l'invariante separato di ch07.

## Fuori portata del browser

- Mail, SPF, DKIM e DMARC.
- La trappola Docker/`FORWARD` e le topologie che richiedono kernel distinti.

Restano nel plugin `qlab-plugin-cyber-lab`, con VM QEMU vere. Non aggiungerli al sito v86.

## Coda per la consegna esterna

- Controllo manuale completo IT/EN e su schermo stretto.
- Integrazione nell'hub Docsify `manzolo/manzolo` (`#/labs`, `#/science`) e README profilo.
- Pubblicazione su `manzolo.github.io/CyberLab`.

Queste operazioni sono intenzionalmente lasciate alla sessione finale di Andrea/Claude.
