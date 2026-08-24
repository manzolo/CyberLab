#!/bin/sh
for f in public internal db; do kill "$(cat /run/cyber-lab/$f.pid)" 2>/dev/null || true; done
