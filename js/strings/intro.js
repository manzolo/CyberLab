// Guida iniziale bilingue: dichiara modello, metodo e confine di sicurezza.
export default {
it: `
<p><strong>Qui impari a difendere un host facendo passare l'attacco vero.</strong>
A sinistra c'è <code>attacker</code>, a destra <code>defender</code>. Puoi digitare in
entrambi i terminali, osservare il traffico e rompere la configurazione; il ripristino
ricrea il mondo dallo snapshot.</p>

<h3>Il metodo</h3>
<p>“Il servizio è attivo” non è una prova. Una difesa è provata quando cambia un fatto
osservabile: una sonda non passa più, un contatore iptables cresce, Fail2ban registra
l'IP reale, un payload PHP che funzionava riceve 403.</p>
<p>Ogni verifica lancia quindi uno stimolo nuovo dall'attaccante e legge il testimone sul
difensore. Non controlla la history e non pretende che tu usi un comando preciso: misura
l'invariante. Token e quantità cambiano con un seme che non conosci.</p>

<h3>Due host, un kernel</h3>
<p>Il Linux è reale ed è emulato nel browser da v86. I due host hanno utenti, indirizzi e
pile di rete distinti, collegati da una veth; condividono però kernel e disco. Sono il
modello di due container, non due computer fisici. Questa differenza è dichiarata perché
un verde va letto solo per ciò che copre.</p>

<h3>Uno zero non basta</h3>
<p>Un sensore a zero può significare “nessuno ha attaccato” oppure “il sensore non vede”.
Nel capitolo sul filtro cieco userai lo stesso registro, prima con un lettore sbagliato e
poi con quello corretto, dopo aver generato N eventi freschi.</p>

<h3>Confine di sicurezza</h3>
<p><strong>Questo è materiale per una LAN isolata.</strong> La VM non ha una route verso
Internet e gli helper offensivi accettano soltanto <code>10.10.0.2</code>, con raffiche
limitate. Non usare payload o tecniche contro sistemi senza autorizzazione.</p>

<h3>Come lavorare</h3>
<p>Leggi il capitolo, segui le pastiglie “attaccante” e “difensore”, poi premi
<em>Verifica</em>. Se fallisce, il responso mostra il fatto misurato e suggerisce dove
guardare. Riavvia le macchine quando vuoi tornare allo stato iniziale.</p>
`,

en: `
<p><strong>Here you learn to defend a host by making the real attack happen.</strong>
<code>attacker</code> is on the left and <code>defender</code> on the right. You can type in
both terminals, observe traffic, and break the configuration; reset recreates the world
from its snapshot.</p>

<h3>The method</h3>
<p>“The service is running” is not evidence. A defence is proven when an observable fact
changes: a probe no longer gets through, an iptables counter increases, Fail2ban records
the real IP, or a PHP payload that worked now receives 403.</p>
<p>Every check therefore launches a fresh stimulus from the attacker and reads the witness
on the defender. It does not inspect history or require a particular command: it measures
the invariant. Tokens and counts change through a seed you do not know.</p>

<h3>Two hosts, one kernel</h3>
<p>Linux is real and emulated in the browser by v86. The hosts have distinct users,
addresses, and network stacks joined by a veth, but they share kernel and disk. They model
two containers, not two physical computers. This distinction is explicit because a green
result should only be read for what it covers.</p>

<h3>Zero is not enough</h3>
<p>A zero sensor may mean “nobody attacked” or “the sensor cannot see”. In the blind-filter
chapter you will read the same log first with a broken reader and then with the correct
one, after generating N fresh events.</p>

<h3>Safety boundary</h3>
<p><strong>This material belongs in an isolated LAN.</strong> The VM has no route to the
Internet, and offensive helpers accept only <code>10.10.0.2</code> with limited bursts.
Do not use payloads or techniques against systems without authorisation.</p>

<h3>How to work</h3>
<p>Read the chapter, follow the “attacker” and “defender” badges, then press
<em>Verify</em>. On failure, the result shows the measured fact and suggests where to look.
Restart the machines whenever you want to return to the initial state.</p>
`,
};
