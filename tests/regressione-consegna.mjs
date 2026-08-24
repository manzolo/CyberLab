#!/usr/bin/env node
// Il giro di un'azione offensiva, fatto come lo fa una persona: DIGITANDO nel terminale.
//
// Perche' un test a parte, quando esiste gia' tests/labs.mjs: quello esegue le
// soluzioni di riferimento attraverso il canale di verifica, cioe' come ROOT. Chi
// studia invece e' `attacker`, e i due mondi si sono separati il giorno in cui i
// terminali hanno smesso di essere root. Qui proviamo che l'attaccante può leggere
// il mondo seminato, inviare davvero la POST e lasciare il testimone sul difensore.
//
// Regola che questo file mette per iscritto: se una cosa la fara' l'utente
// scrivendola, il test deve scriverla. Passare dal canale di servizio prova
// un'altra cosa.

import path from "node:path";
import url from "node:url";

const ROOT = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const { V86 } = await import(path.join(ROOT, "vendor/v86/libv86.mjs"));

const emu = new V86({
    memory_size: 128 * 1024 * 1024, vga_memory_size: 2 * 1024 * 1024,
    uart1: true, uart2: true,
    disable_mouse: true, disable_keyboard: true, disable_speaker: true,
    bzimage_initrd_from_filesystem: true,
    cmdline: "rw root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose " +
             "modules=virtio_pci tsc=reliable init_on_free=on console=ttyS0",
    bios: { url: path.join(ROOT, "vendor/v86/seabios.bin") },
    vga_bios: { url: path.join(ROOT, "vendor/v86/vgabios.bin") },
    wasm_path: path.join(ROOT, "vendor/v86/v86.wasm"),
    autostart: true,
    filesystem: { baseurl: path.join(ROOT, "images/rootfs") },
    initial_state: { url: path.join(ROOT, "images/state.bin.zst") },
});

let buf = "", prossimo = 1;
const attesa = new Map();
emu.add_listener("serial1-output-byte", b => {
    buf += String.fromCharCode(b);
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
        const r0 = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!r0) continue;
        let m; try { m = JSON.parse(r0); } catch { continue; }
        const f = attesa.get(m.id); if (f) { attesa.delete(m.id); f(m); }
    }
});
const chiedi = (op, arg, ms = 90000) => new Promise((res, rej) => {
    const id = prossimo++;
    attesa.set(id, res);
    emu.serial_send_bytes(1, new TextEncoder().encode(`${id} ${op}${arg ? " " + arg : ""}\n`));
    setTimeout(() => { if (attesa.delete(id)) rej(new Error(`timeout ${op}`)); }, ms);
});
const b64 = t => Buffer.from(t, "utf8").toString("base64");
const sh = async (s, ms) => ((await chiedi("sh", `echo ${b64(s)} | base64 -d | sh`, ms)).out || "").trim();

let visto = "";
emu.add_listener("serial0-output-byte", b => { visto += String.fromCharCode(b); });
const pausa = ms => new Promise(r => setTimeout(r, ms));
/** Scrive come una persona: un carattere per volta. La seriale emulata ha una FIFO
 *  piccola e nessun controllo di flusso — riversarle addosso una riga intera in un
 *  colpo solo ne fa perdere dei pezzi. */
async function digita(testo) {
    for (const c of testo) { emu.serial_send_bytes(0, new TextEncoder().encode(c)); await pausa(6); }
}
const pulito = s => s.replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, "").replace(/\r/g, "");

const guai = [];
const ok = m => console.log(`  OK   ${m}`);
const ko = m => { console.log(`  KO   ${m}`); guai.push(m); };

// --- via -------------------------------------------------------------------
for (let t = 1; ; t++) {
    try { await chiedi("ping", null, 5000); break; }
    catch { if (t > 30) { console.error("la macchina non risponde"); process.exit(1); } }
}

// Il mondo dell'archivio non autenticato, seminato come lo semina il sito.
const seed = await import("node:fs").then(fs => fs.readFileSync(path.join(ROOT, "content/ch02/e1/seed.sh"), "utf8"));
const check = await import("node:fs").then(fs => fs.readFileSync(path.join(ROOT, "content/ch02/e1/check.sh"), "utf8"));
await chiedi("write", `/opt/lab/ch02/e1/seed.sh 755 ${b64(seed)}`);
await chiedi("write", `/opt/lab/ch02/e1/check.sh 755 ${b64(check)}`);
const s = await chiedi("seed", "ch02/e1 424242");
if (!s.ok) { console.error("il seed e' fallito:", s.out); process.exit(1); }

const tokenAtteso = await sh("cat /home/attacker/lab/token.txt");

// chi digita e' attacker, e deve essere attacker
emu.serial_send_bytes(0, new TextEncoder().encode("\n"));
await pausa(1500);
visto = "";
await digita("whoami\n");
await pausa(2500);
pulito(visto).includes("attacker")
    ? ok("il terminale del pc e' di attacker, non di root")
    : ko(`chi digita non e' attacker: ${JSON.stringify(pulito(visto).slice(-60))}`);

// L'ATTACCO, digitato
visto = "";
// Tre righe corte: la UART è proprio l'oggetto della regressione e una riga da
// cento caratteri confonderebbe il test dell'azione con un test di paste massivo.
await digita("cd ~/lab\n");
await pausa(1200);
await digita("u=http://10.10.0.2:9000/store\n");
await pausa(1200);
visto = "";
await digita("curl -sS -X POST --data-binary @token.txt $u\n");
await pausa(6000);
const uscita = pulito(visto);

uscita.includes("Permission denied") || uscita.includes("can't open")
    ? ko(`l'attaccante non legge il mondo seminato: ${JSON.stringify(uscita.slice(0, 120))}`)
    : ok("l'attaccante legge il token senza errori di permessi");

uscita.includes("STORED")
    ? ok(`il servizio conferma la POST col token seminato (${tokenAtteso})`)
    : ko(`il servizio non conferma la POST: ${JSON.stringify(uscita.slice(0, 140))}`);

// E la verifica deve vedere store e IP nel registro del difensore.
const v = await chiedi("check", "ch02/e1");
v.ok ? ok("la verifica vede effetto remoto e IP reale")
     : ko(`la verifica non vede l'attacco: ${(v.out || "").replace(/\n/g, " | ").slice(0, 160)}`);

// il seme deve restare intoccabile: l'area e' aperta all'utente, ma con lo sticky
// bit, e il seme e' di root. Se si potesse riscrivere, l'anti-trucco cadrebbe.
visto = "";
await digita("echo 999 > /opt/lab/state/seed 2>&1; cat /opt/lab/state/seed\n");
await pausa(3500);
pulito(visto).includes("424242")
    ? ok("il seme resta di root: l'utente non lo puo' riscrivere")
    : ko(`il seme e' stato riscritto dall'utente: ${JSON.stringify(pulito(visto).slice(-80))}`);

console.log(guai.length ? `\n${guai.length} problemi` : "\ntutto verde");
emu.destroy();
process.exit(guai.length ? 1 : 0);
