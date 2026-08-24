# Componenti di terze parti / Third-party components

Cyber Lab ridistribuisce l'emulatore, il terminale, firmware e un rootfs Linux completo.
Cyber Lab redistributes the emulator, terminal, firmware, and a complete Linux rootfs.

## Nel repository / In the repository

| Componente / Component | Versione / Version | Licenza / Licence | Percorso / Path |
|---|---:|---|---|
| [v86](https://github.com/copy/v86) | 0.5.432 | BSD-2-Clause | `vendor/v86/` |
| v86 filesystem tools | stessa distribuzione / same distribution | BSD-2-Clause | `vendor/v86/tools/` |
| [xterm.js](https://github.com/xtermjs/xterm.js) | 5.5.0 | MIT | `vendor/xterm/` |
| [SeaBIOS](https://www.seabios.org/) | distribuito da v86 / bundled by v86 | LGPL-3.0 | `vendor/v86/seabios.bin` |
| VGABIOS | distribuito da v86 / bundled by v86 | LGPL-2.1 | `vendor/v86/vgabios.bin` |

I testi integrali sono nei rispettivi file `LICENSE` sotto `vendor/`.
Full licence texts are in each component's `LICENSE` file under `vendor/`.

## Immagine Linux / Linux image

`lab/Dockerfile.v86` costruisce un rootfs x86 da **Alpine Linux 3.21**
(`i386/alpine:3.21.0`). L'ultima build contiene **174 pacchetti**; l'elenco esatto con
versioni è generato in [`lab/packages.lock`](lab/packages.lock).

`lab/Dockerfile.v86` builds an x86 rootfs from **Alpine Linux 3.21**
(`i386/alpine:3.21.0`). The latest build contains **174 packages**; the exact generated
version inventory is [`lab/packages.lock`](lab/packages.lock).

Fra i componenti didatticamente rilevanti / Notable teaching components:

- Linux kernel Alpine `virt`;
- OpenSSH client/server;
- PHP 8.3;
- Fail2ban e `py3-inotify`;
- iptables/nftables;
- nmap, curl e BusyBox extras;
- Bash, sudo e util-linux.

Questi pacchetti mantengono le licenze dei rispettivi progetti (tra cui GPL, LGPL, MIT,
BSD e Apache). I sorgenti corrispondenti sono disponibili nei mirror e repository
ufficiali Alpine: <https://dl-cdn.alpinelinux.org/alpine/v3.21/>.

These packages retain their upstream licences (including GPL, LGPL, MIT, BSD, and
Apache). Corresponding sources are available from Alpine's official mirrors and
repositories: <https://dl-cdn.alpinelinux.org/alpine/v3.21/>.

## Codice e contenuti / Code and content

Codice originale, testi ed esercizi di Cyber Lab: **MIT © 2026 Andrea Manzi (manzolo)**.
Original Cyber Lab code, text, and exercises: **MIT © 2026 Andrea Manzi (manzolo)**.
