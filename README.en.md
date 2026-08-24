# EDU-CYBER · Cyber Lab

**Learn defence by making the real attack go through.** Two Linux hosts side by side in
the browser: attacker on the left, defender on the right, with an isolated LAN between them.

[Versione italiana](README.md)

## The thesis

A running service does not prove that a defence works. Evidence is an observed effect: a
ban containing the real IP in the defender log, an iptables counter that increases, or an
exploit that worked before and fails afterwards. Every check therefore creates a fresh
attack and reads the witness on the defender. It never reads attacker history or treats
`systemctl is-active` as proof.

Zero is ambiguous too: it may mean “nobody attacked” or “the filter is blind”. The lab
separates those cases by attacking and measuring again. Values, tokens and counts derive
from a seed unknown to the learner, so an answer cannot be hard-coded.

## What actually runs

The Linux kernel runs in WebAssembly through [v86](https://github.com/copy/v86); terminals
use [xterm.js](https://xtermjs.org/). One kernel contains two network namespaces,
`attacker` (`10.10.0.1`) and `defender` (`10.10.0.2`), joined by a veth pair. Their network
stacks and users are distinct, while kernel and disk are shared: they are two real hosts,
not two separate computers, and chapter 1 says so plainly.

The site is static and bilingual, with no CDN, runtime dependencies, or frontend build.
The world is created inside the snapshot; `ttyS0` and `ttyS2` feed the visible terminals,
while isolated `ttyS1` carries verification.

## Safety

This material is for an isolated lab. The VM has no default route, and offensive helpers
accept only the fixed internal target `10.10.0.2`, with tightly limited bursts. Do not use
these techniques or payloads against systems without authorisation.

## Syllabus

| | Chapter |
|---:|---|
| 01 | Two machines and the attack surface |
| 02 | The service you did not know you had |
| 03 | Manual filtering: the counter |
| 04 | Three zones: public, internal, never |
| 05 | The burst |
| 06 | Fail2ban: the ban is the proof |
| 07 | The blind filter |
| 08 | Web/PHP: reflected XSS |
| 09 | Web/PHP: path traversal |
| 10 | Web/PHP: command execution |
| 11 | Who is the credible witness |

Mail with SPF/DKIM/DMARC and the Docker/`FORWARD` trap require the QEMU plugin and are not
included in the browser lab.

## Run locally

```bash
npm run image       # builds rootfs and snapshot; needs Docker and zstd
npm run serve       # http://localhost:8803
npm test            # structure and bilingual content
npm run test:labs   # every exercise in the real VM, across three seeds
```

Additional benches: `npm run e2e`, `npm run test:intestazione`, and
`npm run test:regressione`. Chapters can be read before building the image; only the
machines are unavailable without it.

See [BACKLOG.md](BACKLOG.md) for the exact scope of every green result and
[STATO.md](STATO.md) for architecture decisions and paid-for failures.

## Licence

MIT © Andrea Manzi (manzolo). Redistributed software and licences are listed in
[THIRD-PARTY.md](THIRD-PARTY.md).
